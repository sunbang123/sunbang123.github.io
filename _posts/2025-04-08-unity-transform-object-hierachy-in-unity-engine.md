---
layout: post
title: "Unity transform: object hierachy in unity engine"
date: 2025-04-08 17:14:02 +0900
categories: 
tags: [Unity]
---


# Unity의 계층 구조 탐색과 Transform 사용 이유

## ✅ 결론

Unity에서 자식 오브젝트를 탐색할 때는  
`GameObject`가 아닌 `Transform`을 사용해야 한다.  

그 이유는 **Unity의 계층 구조가 Transform을 기준으로 구성되고**,  
`Transform`은 Unity C++ 엔진의 핵심 계층 정보와 연결되기 때문이다.

---

## 🔍 근거 1: Unity 계층 구조는 Transform이 담당한다

Unity의 오브젝트들은 **부모-자식 구조로 연결된 트리(Tree)**를 이룬다.  
이 구조는 `GameObject`가 아닌 **`Transform` 컴포넌트에 의해 형성**된다.  

- 모든 `GameObject`는 반드시 하나의 `Transform`을 포함한다.  
- 자식 오브젝트들은 `Transform`의 자식 목록에 들어간다.  
- 위치, 회전, 스케일 외에도 계층 구조까지 관리한다.  

따라서 **계층 탐색은 Transform을 통해서만 가능하다.**

---

## 🔍 근거 2: Transform은 계층 탐색 기능을 제공한다

`Transform`은 자식 오브젝트를 탐색하기 위한 다양한 기능을 제공한다.  

- `transform.GetChild(i)`로 i번째 자식 접근  
- `transform.childCount`로 자식 수 확인  
- `GetComponentsInChildren<T>()`로 재귀 탐색 가능  

이 기능들은 `GameObject` 자체가 아닌  
`Transform`에만 존재한다.

---

## 🔍 근거 3: Transform은 단순 위치 정보가 아닌 계층 구조의 핵심이다

많은 개발자들은 `Transform`이 단순히  
위치, 회전, 크기 정보를 담는다고 생각한다.  

하지만 실제로는 Unity 엔진에서 **계층 관계를 정의하는 핵심 컴포넌트**이다.  

- 부모 오브젝트의 위치가 바뀌면  
  자식 오브젝트도 함께 영향을 받는다.  
- 이는 오브젝트들이 `Transform` 트리 구조로  
  강하게 연결되어 있기 때문이다.

---

## 💡 예시: FindChild 메서드에서의 Transform 활용

다음은 자식 오브젝트를 찾는 예시 코드이다:

```csharp
Transform transform = FindChild<Transform>(go, name, recursive);
if (transform == null)
    return null;
return transform.gameObject;
```

- `Transform`으로 자식 탐색을 수행한 후  
  해당 오브젝트의 `gameObject`를 반환한다.  
- 재귀 여부나 이름 조건 등 다양한 경우를 효율적으로 처리할 수 있다.

---

## 🧠 Unity는 왜 C++ 기반인가?

### ✅ 결론  
Unity는 우리가 **C#으로 스크립트를 작성**하지만,  
**엔진 자체는 고성능 C++로 구현**되어 있다.  

따라서 `GameObject.transform`도 내부적으로는  
C++ 코드와 상호작용하는 구조다.

---

### 🔧 Unity 구조 요약

Unity는 다음과 같은 구조로 되어 있다:

1. **C++ Native Engine Layer**  
   - 렌더링, 물리, 오디오 등 성능이 중요한 시스템이 구현됨  
   - `Transform`, `Rigidbody`, `Mesh` 등이 여기에서 동작함  

2. **C# Scripting Layer**  
   - 우리가 작성하는 코드 (예: `Start()`, `Update()` 등)  
   - 엔진의 기능을 "제어"하고 "명령"을 내리는 역할  

3. **Interop 바인딩 Layer (C# ↔ C++)**  
   - `InternalCall`, `Injected`, `IL2CPP` 등의 기술로  
     C#에서 C++ 함수 호출을 가능하게 함

---

### 🔍 예시: GameObject.transform 내부 구현

Unity C# 내부에서는 다음과 같이 구현되어 있다:

```csharp
public Transform transform
{
    [FreeFunction("GameObjectBindings::GetTransform", HasExplicitThis = true)]
    get
    {
        IntPtr intPtr = MarshalledUnityObject.MarshalNotNull(this);
        if (intPtr == (IntPtr)0)
        {
            ThrowHelper.ThrowNullReferenceException(this);
        }
        return Unmarshal.UnmarshalUnityObject<Transform>(get_transform_Injected(intPtr));
    }
}
```

- `GameObject.transform`은 단순 프로퍼티가 아니다.  
- 내부적으로 C++ 엔진 함수 `GetTransform`을 호출한다.  
- `MarshalledUnityObject`, `Unmarshal`, `Injected`는  
  C++ ↔ C# 간 포인터를 안전하게 전달하고 변환하는 장치다.

---

## 📝 최종 요약

> Unity에서 오브젝트 간의 계층 구조는 `Transform`을 통해 구현된다.  
> 자식 탐색 등 모든 계층 관련 작업은 `Transform`을 사용해야 하며,  
> 그 이유는 `Transform`이 Unity C++ 엔진의 계층 구조 중심이기 때문이다.  
> 비록 우리는 C#으로 코딩하지만,  
> 내부적으로는 C++ 기반의 고성능 엔진과 상호작용하고 있는 것이다.
