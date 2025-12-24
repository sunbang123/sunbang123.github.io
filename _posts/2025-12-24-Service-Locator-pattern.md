---
layout: post
title: "서비스 로케이터 패턴/ 제네릭 데이터 접근 방식"
date: 2025-12-24 20:53:00 +0900
categories: 
tags: ["Unity", "Csharp"]
---

## [C# / Unity] "이거 이름이 뭐야?" GetGetComponent 같은 나만의 데이터 매니저 만들기

코딩을 하다 보면 유니티의 `GetComponent<T>()`처럼 **"내가 필요한 타입(T) 좀 이 리스트에서 찾아와봐"** 하는 식의 코드를 짜게 될 때가 있어요.

---

### 1. 이 패턴의 정체는?

이런 방식은 보통 **서비스 로케이터(Service Locator) 패턴** 혹은 **제네릭 데이터 접근(Generic Data Access)** 방식이라고 부릅니다.

* **서비스 로케이터:** 중앙 저장소(Manager)에 객체들을 모아두고, 필요할 때마다 타입(`T`)을 키(Key)로 삼아 찾아가는 방식입니다. 이 포스팅에서는 타입 기반의 선형 탐색으로 접근해보았습니다.
* **컴포넌트 기반 설계:** 유니티의 `GetComponent<T>()`와 철학이 같습니다. 데이터를 파편화해서 들고 있다가 필요할 때 쓰는것이죠.

### 2. 코드 뜯어보기 (Code Analysis)

```csharp
public T GetUserData<T>() where T : class, IUserData
{
    // 리스트를 돌면서 T 타입인 첫 번째 녀석을 리턴!
    return UserDataList.OfType<T>().FirstOrDefault();
}

```

* **`where T : class, IUserData`**: 아무거나 넣지 마! 반드시 클래스여야 하고 `IUserData` 인터페이스를 상속받은 놈만 가져오겠다는 **제약 조건**입니다.
* **`OfType<T>()`**: LINQ의 축복이야. 리스트 안에서 `T` 타입인 애들만 걸러내줍니다.
* **`FirstOrDefault()`**: 찾으면 그것을 주고, 없으면 `null`을 줌. 그래서 호출부에서 `null` 체크가 필수!

---

### 3. 왜 이렇게 써? (장점)

1. **확장성 (Scalability):** 새로운 데이터(`UserPetData` 등)가 추가되어도 `GetUserData` 함수는 수정할 필요가 없습니다. 그냥 만들고 리스트에 넣으면 끝!
2. **가독성 (Readability):** 호출하는 쪽에서 `(UserInventoryData)data` 처럼 지저분하게 형변환(Casting)을 할 필요가 없어요. `<T>`가 다 해주니까.
3. **유연성:** `IUserData`라는 큰 틀 안에서 다양한 데이터를 한 리스트로 관리할 수 있어요.

### 4. 주의할 점 (단점 & 꿀팁)

이 방식은 **성능(Performance)** 이슈가 살짝 있어요.

* **문제점:** `OfType<T>()`는 호출될 때마다 리스트를 처음부터 끝까지 순회(Loop)해. 데이터가 1,000개면 매번 1,000번 확인하게됩니다.
* **해결책:** 만약 데이터가 너무 많다면, **Dictionary**를 써서 한 번 찾은 건 캐싱해두는 게 좋습니다.

---

### 5. 한 줄 요약

> **"중앙 집중형 제네릭 접근 방식"**으로, 유연하고 깔끔한 코드를 지향하지만 데이터가 많아지면 캐싱을 고민해야 하는 패턴!
