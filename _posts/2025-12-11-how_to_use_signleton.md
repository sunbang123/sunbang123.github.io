---
layout: post
title: "How_to_use_signleton"
date: 2025-12-11 01:36:53 +0900
categories: 
tags: 
---

## 🛠️ Unity 개발자의 생존 가이드: 지긋지긋한 Null 참조 오류, 싱글턴으로 박멸하기

안녕하세요, Null 참조 오류(NRE) 때문에 밤잠 설치던 동료 개발자 여러분\!

Unity 프로젝트에서 `NullReferenceException`만큼 개발자를 괴롭히는 오류가 또 있을까요? 저는 이 오류를 극복하고 더 안정적인 코드를 만들기 위해 고군분투했던 저의 경험과, 그 과정에서 얻은 완벽에 가까운 싱글턴 패턴 코드를 여러분께 공유하고자 합니다.

### 1\. 🤯 나의 Null 참조 오류 대처 히스토리

솔직히 말하면, 대부분의 Null 참조 오류는 **'참조가 제대로 안 돼서'** 발생하는 아주 기초적인 실수였습니다.

#### 1.1. 초기 삽질: 이름 찾기와 수동 할당의 늪

가장 최초에 겪었던 NRE는 아마도 오브젝트를 이름으로 찾다가 생겼던 것 같아요.

> `GameObject.Find("MonsterPrefab")`

이런 식으로 찾았는데, Prefab을 복제(Clone)하면서 같은 이름의 오브젝트가 잔뜩 생겨버리니, 시스템이 뭘 찾아야 할지 혼란스러워했던 거죠.

결국, 저는 Inspector 창에 컴포넌트를 **직접 드래그해서 할당**하는 번거로움을 감수했습니다. 가끔 Tag를 활용하기도 했지만, 프로젝트가 커지니 이건 정말 **비용이 많이 드는(High Overhead) 작업**이었습니다. 휴먼 에러는 기본이고, 실수로 레퍼런스가 빠지기 일쑤였죠.

#### 1.2. 싱글턴으로의 도약

그래서 제가 찾은 해답은 **싱글턴 패턴**이었습니다.

매니저 클래스를 싱글턴으로 만들면, `GameManager.Instance.DoSomething()`처럼 **전역적인 static 접근**이 가능해져 참조하기가 엄청나게 쉬워졌습니다. 한 단계 더 나아가, 씬 전환에도 매니저를 유지하기 위해 `DontDestroyOnLoad`도 붙여보았죠.

하지만 여기서부터 새로운 문제가 발생하기 시작했습니다.

### 2\. ⚠️ 완벽한 싱글턴 코드에도 발생하는 두 가지 함정

제가 만든 싱글턴 코드는 분명히 중복 생성을 막고, 안전하게 인스턴스를 관리하도록 설계되었습니다. (나중에 공개할게요\!) 그럼에도 불구하고 NRE는 발생했고, 저는 두 가지 미묘한 함정을 깨달았습니다.

#### 함정 A: 초기화 순서의 꼬임 (Awake vs. 참조)

Unity의 실행 순서는 예측 불가능할 때가 있습니다. 특히 Addressable 같은 비동기 로딩 시스템을 사용할 때 더 심했죠.

**`SingletonManager`의 `Awake()`가 실행되기도 전에**, 다른 스크립트가 `SingletonManager.Instance`에 접근하는 순간, 싱글턴의 인스턴스는 여전히 **Null**이 됩니다.

#### 함정 B: 씬 전환 시 중복 방지 로직의 오해

혹시 실수로 씬에 매니저를 두 번 배치하거나, `DontDestroyOnLoad`가 된 상태에서 매니저가 포함된 씬을 다시 로드하는 경우가 있습니다.

이때, 제 싱글턴 코드는 이미 존재하는 인스턴스(기존 인스턴스)를 발견하고 **새로 생성된 인스턴스를 즉시 `Destroy`** 시켜버립니다. 코드는 완벽했지만, 눈이 피로해서 Inspector를 자세히 보지 못하고 매니저를 두 개 배치했던 그날의 실수는... 정말 기초적인 실수였죠.

-----

### 3\. 🛡️ Null 참조를 원천 봉쇄하는 '안전한 싱글턴' 구조

결국, Null 참조 오류를 막기 위한 핵심은 \*\*"참조하려는 시점에는 무조건 유효한 인스턴스가 존재해야 한다"\*\*는 것을 보장하는 것입니다.

제가 사용하는 **Generic Singleton Behaviour** 코드는 다음과 같습니다. (여러분도 이대로 사용하세요\!)

```csharp
using UnityEngine;

public class SingletonBehaviour<T> : MonoBehaviour where T : SingletonBehaviour<T>
{
    // 씬 전환 시 삭제할지 여부
    protected bool m_IsDestroyOnLoad = false;
    protected static T m_Instance;

    // ⭐️ [보안 강화 지점 1: Lazy Instantiation 및 Null 검증] ⭐️
    public static T Instance
    {
        get 
        { 
            if (m_Instance == null)
            {
                // 인스턴스가 없을 때 씬에서 찾거나 경고합니다.
                m_Instance = FindObjectOfType<T>(); 

                if (m_Instance == null)
                {
                    Debug.LogError($"[Singleton] {typeof(T).Name} 인스턴스를 찾을 수 없습니다. 씬에 배치되었는지 확인하세요.");
                }
            }
            return m_Instance;
        }
    }

    private void Awake()
    {
        Init();
    }

    protected virtual void Init()
    {
        if(m_Instance == null)
        {
            m_Instance = (T)this;

            if(!m_IsDestroyOnLoad)
            {
                DontDestroyOnLoad(gameObject); // gameObject로 명시
            }
        }
        else
        {
            // ⭐️ [보안 강화 지점 2: 중복 인스턴스 파괴] ⭐️
            // 이미 인스턴스가 있다면, 새로 생성된 자신을 파괴!
            Destroy(gameObject);
        }
    }

    protected virtual void OnDestroy()
    {
        Dispose();
    }

    protected virtual void Dispose()
    {
        // 파괴될 때만 Null로 만들어, 다른 곳에서 Instance를 찾을 수 있게 함
        if (m_Instance == this)
        {
             m_Instance = null;
        }
    }
}
```

#### ✅ 이 코드가 Null 참조를 막는 두 가지 핵심 원리

1.  **Awake 시의 중복 방지 (`Init()`):**
    씬에 여러 개가 있더라도, 가장 먼저 `Awake`가 된 인스턴스만 살아남고 나머지는 즉시 파괴됩니다. (함정 B 방어)
2.  **접근 시점의 Lazy 검증 (`Instance` Getter):**
    설령 다른 스크립트가 `Awake` 전에 `Instance`에 접근하더라도, Getter 내부에서 `m_Instance == null`일 때 **씬에서 찾으려는 시도**를 합니다. (함정 A에 대한 추가 방어선)

-----

### 4\. 🎁 보너스 팁: Inspector 수동 할당을 코드 레벨에서 자동화하기

Inspector에 하나하나 컴포넌트를 드래그하는 작업은 이제 그만\! **클래스로 찾는 것**이야말로 진정한 안정성을 가져옵니다.

저는 컴포넌트를 가져올 때 `[SerializeField]`와 `Awake`의 `GetComponent`를 조합하여 사용합니다.

```csharp
public class MyPlayer : MonoBehaviour
{
    // private이지만 Inspector에 노출하여 (혹시 모를) 수동 할당 옵션을 둡니다.
    [SerializeField] 
    private Rigidbody _rigidbody; 

    private void Awake()
    {
        // Inspector에 할당되지 않았다면, 코드가 자동으로 현재 오브젝트에서 Rigidbody를 찾습니다.
        if (_rigidbody == null)
        {
            _rigidbody = GetComponent<Rigidbody>();
        }

        // 그래도 Null이라면, Null 참조 오류를 피하고 경고를 출력합니다.
        if (_rigidbody == null)
        {
            Debug.LogError("Rigidbody 컴포넌트가 이 오브젝트에 없습니다!");
            // this.enabled = false; 와 같이 추가 조치를 할 수 있습니다.
        }
    }
}
```

이 방식을 사용하면, `Awake` 시점에 `_rigidbody`가 **Null이 아님**을 보장할 수 있어 런타임 NRE를 크게 줄일 수 있습니다.

> **TIP:** Unity Inspector 우측 상단의 햄버거 메뉴를 눌러 **Debug Mode**를 켜보세요. `private` 변수까지도 Inspector에 할당된 값이나 런타임 값을 확인할 수 있어 디버깅이 훨씬 쉬워집니다.

-----

Null 참조 오류는 개발 여정의 친구이자 숙적입니다. 하지만 완벽하게 설계된 싱글턴과 자동 할당 방식을 통해 우리는 더욱 빠르고 안정적인 코드를 만들 수 있습니다\!

여러분의 Unity 개발도 이 코드를 통해 더욱 안정적이 되길 바랍니다\!

다음 가이드는 여러분의 프로젝트 환경(예: Addressable 사용 여부)에 맞춰 싱글턴 초기화 순서를 더 강력하게 보장하는 방법으로 돌아오겠습니다.