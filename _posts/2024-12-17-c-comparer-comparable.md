---
layout: post
title: "Comparer vs Comparable and Enumerable vs Enumerator in C#"
date: 2024-12-17 17:58:57 +0900
categories: 
tags: 
---

# Comparer vs Comparable and Enumerable vs Enumerator in C#

## 1. Comparer and Comparable

### 1.1 Comparer (IComparer)
- **정의**: `IComparer`는 두 객체를 비교하는 **외부 비교자** 인터페이스입니다.
- **주요 역할**: 정렬 기준을 별도의 클래스로 구현해 객체의 정렬을 수행합니다.
- **핵심 메서드**: `int Compare(object x, object y)`를 구현하여 두 객체의 크기 비교를 수행합니다.
- **장점**: 여러 가지 정렬 기준을 적용할 수 있습니다.

#### 사용 예제:
```csharp
class PointCompare : IComparer<Point>
{
    public int Compare(Point x, Point y)
    {
        return x.X - y.X; // X 좌표 기준 비교
    }
}
```

### 1.2 Comparable (IComparable)
- **정의**: `IComparable`은 클래스 내부에 비교 기준을 구현하는 **내부 비교자** 인터페이스입니다.
- **주요 역할**: 객체가 스스로 정렬 기준을 정의하며, `CompareTo` 메서드를 통해 비교 로직을 제공합니다.
- **핵심 메서드**: `int CompareTo(object other)`를 구현하여 객체 자신과 다른 객체를 비교합니다.
- **장점**: 객체 자체가 비교 가능한 상태가 됩니다.

#### 사용 예제:
```csharp
class Point : IComparable<Point>
{
    public int X { get; set; }
    public int CompareTo(Point other)
    {
        return this.X - other.X; // X 좌표 기준 비교
    }
}
```

### 1.3 비교 요약
| **구분**         | **Comparer (IComparer)**         | **Comparable (IComparable)**     |
|------------------|--------------------------------|---------------------------------|
| **비교자**       | 외부 비교자                     | 내부 비교자                     |
| **정렬 기준**     | 여러 정렬 기준 구현 가능          | 하나의 정렬 기준만 구현           |
| **사용 메서드**   | `Compare`                      | `CompareTo`                    |
| **객체의 역할**   | 객체는 비교 로직을 몰라도 됨      | 객체 스스로 비교 기준 정의         |

---

## 2. Enumerable and Enumerator

### 2.1 Enumerable (IEnumerable)
- **정의**: `IEnumerable`은 컬렉션이 순회 가능하도록 하는 인터페이스입니다.
- **주요 역할**: 열거자(Enumerator)를 제공하여 `foreach` 구문에서 컬렉션을 순회할 수 있도록 합니다.
- **핵심 메서드**: `IEnumerator GetEnumerator()`를 구현합니다.

#### 사용 예제:
```csharp
class MyCollection : IEnumerable
{
    private int[] data = { 1, 2, 3 };

    public IEnumerator GetEnumerator()
    {
        return data.GetEnumerator();
    }
}
```

### 2.2 Enumerator (IEnumerator)
- **정의**: `IEnumerator`는 컬렉션의 요소를 **순회하는 객체**입니다.
- **주요 역할**: 컬렉션 내 요소를 하나씩 탐색하며 현재 위치를 관리합니다.
- **핵심 메서드**:
  - `MoveNext()`: 다음 요소로 이동합니다.
  - `Current`: 현재 요소를 반환합니다.
  - `Reset()`: 처음으로 돌아갑니다.

#### 사용 예제:
```csharp
IEnumerator enumerator = myCollection.GetEnumerator();
while (enumerator.MoveNext())
{
    Console.WriteLine(enumerator.Current);
}
```

### 2.3 비교 요약
| **구분**         | **Enumerable (IEnumerable)**    | **Enumerator (IEnumerator)**   |
|------------------|--------------------------------|--------------------------------|
| **역할**         | 컬렉션이 순회 가능함을 나타냄     | 컬렉션의 요소를 하나씩 순회       |
| **제공 메서드**   | `GetEnumerator()`              | `MoveNext()`, `Current`        |
| **사용 시점**     | `foreach` 시작 시 호출           | `foreach` 내부에서 요소 접근     |
| **관계**         | 열거자를 반환하는 역할            | 실제 순회를 수행하는 객체         |

---

## 결론
1. **Comparer**는 외부에서 비교를 수행하며, 여러 기준을 설정할 수 있습니다.
2. **Comparable**은 객체 내부에서 비교 기준을 정의하여 객체 자체를 비교 가능하게 만듭니다.
3. **Enumerable**은 컬렉션이 순회 가능함을 나타내며, **Enumerator**를 반환합니다.
4. **Enumerator**는 컬렉션을 실제로 순회하는 객체로, `MoveNext`, `Current`, `Reset`을 통해 순회를 제어합니다.

