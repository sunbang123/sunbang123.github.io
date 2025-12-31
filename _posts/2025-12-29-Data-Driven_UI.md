---
layout: post
title: "데이터 중심(Data-Driven) UI 구조"
date: 2025-12-29 20:53:00 +0900
categories: 
tags: "Unity"
---

## [Unity/C#] 데이터 중심(Data-Driven) UI 구조: 왜 as와 프로퍼티를 쓸까?

유니티에서 UI를 구현할 때, 단순히 `GameObject`를 참조해서 값을 바꾸는 방식은 프로젝트가 커질수록 한계에 부딪힙니다. 오늘은 더 유연하고 유지보수가 쉬운 **'데이터 중심 UI'** 설계에서 자주 쓰이는 기술적 장치들을 알아보겠습니다.

---

### 1. 왜 `as` 연산자로 데이터를 형 변환할까?

UI 시스템(예: 스크롤 뷰)은 보통 범용성을 위해 부모 클래스인 `BaseData` 타입을 인자로 받습니다. 하지만 구체적인 UI 항목(예: 챕터 아이템)을 그릴 때는 자식 클래스인 `ChapterScrollItemData` 안에만 있는 특정한 정보(챕터 번호, 잠금 해제 여부 등)가 필요하죠.

```csharp
public override void UpdateData(BaseData scrollData)
{
    base.UpdateData(scrollData);
    
    // 안전하게 챕터 데이터로 변환
    m_ChapterScrollItemData = scrollData as ChapterScrollItemData;

    if (m_ChapterScrollItemData != null)
    {
        // 변환 성공 시에만 챕터 전용 로직 수행
    }
}

```

* **안정성:** `(T)` 방식의 강제 캐스팅은 타입이 다를 경우 에러를 내며 게임을 멈추게 하지만, `as`는 변환 실패 시 `null`을 반환하여 프로그램의 흐름을 유지합니다.
* **유연성:** 하나의 UI 시스템이 다양한 형태의 데이터를 안전하게 받아들일 수 있게 합니다.

---

### 2. UI 구조의 꽃, 프로퍼티(Property)의 활용

데이터 중심 구조에서 데이터 클래스의 멤버 변수는 단순히 값을 들고 있는 것에 그치지 않습니다. **프로퍼티**를 사용하면 데이터와 UI 사이의 "연결 고리"를 만들 수 있습니다.

#### ① Setter를 이용한 자동 UI 갱신

데이터 값이 바뀌는 순간 UI가 알아서 바뀌게 만들 수 있습니다. 일일이 "텍스트 바꿔라"라고 명령할 필요가 없어집니다.

```csharp
private int m_Score;
public int Score
{
    get => m_Score;
    set
    {
        if (m_Score == value) return; // 최적화: 값이 같으면 패스
        m_Score = value;
        UpdateScoreText(); // 값이 바뀌면 즉시 UI 업데이트 함수 호출!
    }
}

```

#### ② 데이터 보호 (Encapsulation)

UI는 데이터를 **보여주는 역할**이지, **수정하는 주체**가 되어서는 안 됩니다. 프로퍼티의 `private set`을 활용하면 외부에서 데이터를 함부로 조작하는 것을 막아 버그를 방지합니다.

```csharp
public string ChapterTitle { get; private set; } // 읽기는 OK, 수정은 내부에서만!

```

---

### 3. 데이터 중심 UI 구조의 장점 (정리)

이런 구조를 사용하는 이유는 명확합니다.

1. **재사용성:** UI 프리팹은 그대로 두고 데이터만 갈아 끼우면 상점, 인벤토리, 챕터 선택창 등에 똑같은 시스템을 재활용할 수 있습니다.
2. **유지보수 용이:** "데이터가 바뀌었는데 UI가 안 바뀌어요" 같은 버그를 찾기가 훨씬 쉽습니다. 데이터 클래스의 `set` 부분만 확인하면 되니까요.
3. **확장성:** 새로운 타입의 데이터가 추가되어도 기존 UI 시스템의 큰 틀을 건드릴 필요가 없습니다.

---

### 마치며

데이터 중심 설계는 처음엔 코드가 복잡해 보일 수 있지만, 프로젝트의 규모가 커질수록 그 진가를 발휘합니다. `as`를 통한 안전한 타입 변환과 **프로퍼티**를 활용한 스마트한 UI 갱신으로 더 견고한 게임 구조를 설계를 하는 습관을 기르도록 노력할것입니다.
