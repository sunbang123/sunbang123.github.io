---
layout: post
title: "Unity transform: object hierachy in unity engine"
date: 2025-04-08 17:14:02 +0900
categories: 
tags: [Unity]
---


# Unity의 계층 구조 탐색과 Transform 사용 이유

## 결론

Unity에서 자식 오브젝트를 탐색할 때는 `GameObject`가 아닌 `Transform`을 사용해야 한다.

그 이유는 **Unity의 계층 구조가 Transform을 기준으로 구성되고**, `Transform`은 Unity C++ 엔진의 핵심 계층 정보와 연결되기 때문이다.

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

## Transform으로 자식 탐색하기

자식 오브젝트를 찾을 때는 `Transform`을 사용한다:

```csharp
// i번째 자식 가져오기
Transform child = transform.GetChild(i);

// 자식 수 확인
int count = transform.childCount;

// 모든 자식 컴포넌트 찾기
Component[] components = transform.GetComponentsInChildren<Component>();
```

`GameObject`에는 이런 기능이 없고, `Transform`에만 있다.
