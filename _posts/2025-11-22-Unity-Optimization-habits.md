---
layout: post
title: "유니티 최적화 습관 3가지"
date: 2025-11-22 15:47:00 +0900
categories: 
tags:  ["Unity", "DevLog"]
---

## 유니티 최적화 습관 3가지

게임 개발을 하다 보면 기능 구현에 집중하느라 퍼포먼스를 놓치는 경우가 많습니다. 특히 유니티(Unity)의 C\#은 편리한 기능(Garbage Collection 등)을 제공하지만, 그만큼 메모리 관리에서 주의가 필요합니다.

오늘은 기능 구현 단계에서 무의식적으로 작성하지만, 나중에 프레임 드랍(Frame Drop)의 주범이 될 수 있는 코드 패턴 3가지와 개선 방법을 정리해 봅니다.

### 1\. Update() 문에서의 문자열 연결 (String Concatenation)

UI에 점수나 타이머를 표시할 때 가장 흔하게 하는 실수입니다. C\#의 `string`은 불변(Immutable) 객체이기 때문에, 문자열을 더할 때마다 새로운 메모리를 할당하고 기존 메모리는 가비지(Garbage)가 됩니다.

**안 좋은 예 (Bad Case)**

```csharp
void Update() {
    // 매 프레임마다 새로운 문자열 객체가 생성됨 -> GC 호출 빈도 증가
    scoreText.text = "Current Score: " + currentScore.ToString();
}
```

**개선 방법 (Good Case)**
값이 변할 때만 갱신하거나, `StringBuilder`를 사용합니다.
변경 사항이 생기면 객체를 새로 선언해버리는 string과 다르게, StringBuilder의 값들은 모두 힙 메모리에서 동적으로 존재하기 때문에 내용을 변경해도 추가적인 객체 선언 없이 값을 삽입 및 제거할 수 있다.
<br>
이러한 가변성과 효율성 때문에 string 조작 시 추가적인 메모리 할당이 발생하지 않고, 메모리 할당 및 해제에 필요한 오버헤드도 없어지게 된다.

```csharp
using System.Text; // 네임스페이스 추가
using UnityEngine;

public class StringBuilderExample : MonoBehaviour
{
    // 1. 선언 및 초기화 (용량 설정으로 추가 할당 방지)
    StringBuilder sb = new StringBuilder(256);

    void Update()
    {
        // 버퍼 초기화
        sb.Length = 0; 

        // 2. 문자열 추가
        sb.Append("Score: ");
        sb.Append(100);
        sb.Append(" | Time: ");
        sb.Append(Time.time);

        // 3. UI 텍스트 등에 적용할 때 ToString() 사용
        // string을 새로 생성하지만 빈번한 '+' 연산보다 훨씬 효율적입니다.
        Debug.Log(sb.ToString()); 
    }
}
```

### 2\. LINQ 사용과 메모리 할당

LINQ는 가독성이 뛰어나고 데이터 처리에 강력하지만, 게임 루프(Game Loop) 내에서는 주의해서 사용해야 합니다. LINQ 쿼리는 내부적으로 대리자(Delegate)나 열거자(Enumerator) 객체를 생성하여 힙 메모리(Heap Memory)를 할당하기 때문입니다.

**안 좋은 예 (Bad Case)**

```csharp
void Update() {
    // 매 프레임마다 리스트를 순회하며 객체를 생성함
    var enemies = allGameObjects.Where(g => g.tag == "Enemy").ToList();
}
```

**개선 방법 (Good Case)**
`Update` 문이나 자주 호출되는 메서드에서는 일반적인 `for` 문이나 `foreach` 문을 사용하는 것이 성능상 훨씬 유리합니다. LINQ는 데이터 초기화 단계(`Start`, `Awake`)나 호출 빈도가 낮은 이벤트에서만 사용하는 것을 추천합니다.

### 3\. 태그 비교 (CompareTag) 활용하기

충돌 처리 등에서 오브젝트를 식별할 때 `tag` 프로퍼티를 직접 비교하는 경우가 많습니다. 하지만 `gameObject.tag`를 호출하면 내부적으로 문자열 복사가 발생할 수 있습니다(유니티 버전에 따라 다르지만, 가비지 생성을 피하는 것이 안전합니다).

**안 좋은 예 (Bad Case)**

```csharp
void OnCollisionEnter(Collision collision) {
    if (collision.gameObject.tag == "Player") { // 문자열 할당 발생 가능성
        // ...
    }
}
```

**개선 방법 (Good Case)**
유니티에서 제공하는 `CompareTag` 메서드는 최적화가 되어 있어 메모리 할당 없이 효율적으로 태그를 비교합니다.

```csharp
void OnCollisionEnter(Collision collision) {
    if (collision.gameObject.CompareTag("Player")) {
        // ...
    }
}
```