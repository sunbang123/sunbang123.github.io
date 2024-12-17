---
layout: post
title: "LINQ method"
date: 2024-12-17 19:07:03 +0900
categories: 
tags: 
---

# LINQ 메서드에 대한 보고서

## 1. **LINQ 개요**
LINQ(Language Integrated Query)는 .NET 언어(C#, VB.NET 등)에서 컬렉션 데이터를 쉽게 질의하고 조작할 수 있도록 지원하는 기능입니다. LINQ는 다양한 메서드를 제공하며 컬렉션(배열, 리스트 등)에 대한 정렬, 필터링, 변환 등의 작업을 수행합니다.

LINQ 메서드는 일반적으로 **지연 실행(Deferred Execution)**과 **즉시 실행(Immediate Execution)**을 기반으로 동작합니다.

---

## 2. **LINQ 주요 메서드 분석**

### **2.1 OrderBy 메서드**
- **역할**: 컬렉션의 요소를 특정 기준에 따라 **오름차순으로 정렬**합니다.
- **반환값**: `IEnumerable<T>` 형태로 결과를 반환합니다.
- **지연 실행**: `OrderBy` 메서드는 호출 시점에는 연산이 수행되지 않고, 컬렉션을 열거할 때(예: `foreach` 또는 `ToList`) 정렬이 수행됩니다.

#### **예제 코드**
```csharp
var sortedList = arr.OrderBy(v => v);
```
- `v => v`: 요소 자체를 정렬 기준으로 사용합니다.

**설명**: 이 코드에서는 배열 `arr`의 값을 오름차순으로 정렬하지만, `OrderBy`는 아직 실행되지 않은 상태입니다.

---

### **2.2 Where 메서드**
- **역할**: 컬렉션의 요소 중 특정 조건에 맞는 요소만 필터링합니다.
- **반환값**: `IEnumerable<T>` 형태로 결과를 반환합니다.
- **지연 실행**: `Where` 메서드는 조건을 설정할 뿐, 실제 연산은 데이터 열거 시점에 수행됩니다.

#### **예제 코드**
```csharp
var evenNumbers = arr.Where(v => v % 2 == 0);
```
- 조건: `v % 2 == 0` → 짝수인 요소만 필터링합니다.

**설명**: `Where`는 조건에 맞는 데이터를 반환하지만, 이 시점에서 실제 데이터 연산이 수행되지는 않습니다.

---

### **2.3 ToList 메서드**
- **역할**: `IEnumerable<T>` 형태의 데이터를 즉시 실행하고 결과를 **`List<T>`**로 변환합니다.
- **즉시 실행**: `ToList()`를 호출하면 LINQ 연산이 즉시 실행되어 결과가 메모리에 저장됩니다.
- **용도**:
   - 결과를 메모리에 저장해 빠르게 재사용하고자 할 때 사용합니다.
   - LINQ 메서드에서 반환된 `IEnumerable<T>`를 `List` 형태로 변환해 특정 메서드(예: `ForEach`)를 사용하고자 할 때 필요합니다.

#### **예제 코드**
```csharp
var evenList = arr.Where(v => v % 2 == 0).ToList();
```
- `Where`를 통해 필터링된 데이터를 즉시 실행하고, 결과를 `List<int>` 형태로 저장합니다.

---

### **2.4 yield 키워드와 지연 실행**
- **역할**: `yield return` 키워드를 사용하면 데이터를 **순차적으로 반환**할 수 있습니다.
- **지연 실행**: `yield return`은 데이터를 하나씩 반환하며, 다음 요소를 요청받을 때까지 실행을 중지합니다. 이로 인해 메모리 사용량을 최소화할 수 있습니다.
- **사용 시점**: 큰 데이터를 처리하거나 조건에 따라 데이터를 순차적으로 반환해야 할 때 유용합니다.

#### **yield와 GetEnumerator**

- `yield return`을 사용하면 컴파일러가 **자동으로 `IEnumerable`과 `IEnumerator`를 구현**해 줍니다.

- `yield`를 사용하면 데이터를 순차적으로 반환하는 **상태 기계(state machine)**가 생성되어 `GetEnumerator`의 동작을 간단하게 처리합니다.


#### **예제 코드**
```csharp
IEnumerable<int> GetEvenNumbers(int[] arr)
{
    foreach (var v in arr)
    // `foreach`는 `IEnumerable` 또는 `IEnumerable<T>`를 구현한 모든 타입에서 사용할 수 있습니다. `List<T>`에 한정되지 않습니다.
    {
        if (v % 2 == 0)
        {
            yield return v; // 짝수인 경우에만 반환
        }
    }
}

var evenNumbers = GetEvenNumbers(new int[] { 1, 2, 3, 4, 5 });
foreach (var num in evenNumbers)
{`
    Console.WriteLine(num);
}
```

**실행 결과**:
```
2
4
```

**설명**:
1. `yield return`은 조건에 맞는 데이터를 순차적으로 반환합니다.
2. 데이터를 요청할 때만 조건 검사가 실행되므로 메모리 효율적입니다.
3. 지연 실행의 대표적인 예시입니다.


**컴파일 후 동작**:

1. `GetEvenNumbers` 메서드는 `IEnumerable<int>`를 반환합니다.

2. `yield return`은 **`IEnumerator` 객체**를 생성하고 상태를 저장합니다.

3. `foreach` 루프가 `GetEnumerator()`를 호출하면 상태가 유지된 열거자가 실행됩니다.

- `IEnumerable`을 구현하는 모든 컬렉션은 `GetEnumerator`를 통해 열거자(`IEnumerator`)를 반환합니다.

- `yield`는 컴파일러가 `GetEnumerator` 메서드와 상태 관리를 자동으로 생성하도록 도와줍니다.

- 복잡한 `IEnumerator` 구현 없이도 `yield`를 통해 간결하게 데이터를 순차적으로 반환할 수 있습니다.

---



## 3. **지연 실행 vs 즉시 실행**

### **3.1 지연 실행 (Deferred Execution)**
- `OrderBy`, `Where`와 같은 LINQ 메서드는 **지연 실행**을 사용합니다.
- 데이터 연산은 컬렉션이 열거되는 시점에 수행됩니다. (예: `foreach`, `.ToList()` 호출)

**장점**:
- 메모리 사용이 최적화됩니다.
- 불필요한 연산을 피할 수 있습니다.

**단점**:
- 동일한 연산을 여러 번 열거하면 다시 계산이 수행됩니다.

#### **예시**
```csharp
var query = arr.Where(v => v % 2 == 0);
foreach (var item in query)
{
    Console.WriteLine(item);
}
```
- `Where`는 지연 실행되므로 `foreach`를 호출할 때 실제 필터링이 수행됩니다.

---

### **3.2 즉시 실행 (Immediate Execution)**
- `ToList()`나 `ToArray()`를 호출하면 LINQ 연산이 **즉시 실행**됩니다.
- 결과는 메모리에 저장되므로 이후에는 빠르게 접근할 수 있습니다.

**장점**:
- 결과가 한 번 계산되고 메모리에 저장됩니다.
- 동일한 데이터를 여러 번 사용할 때 성능이 개선됩니다.

**단점**:
- 메모리를 추가로 차지합니다.

#### **예시**
```csharp
var result = arr.Where(v => v % 2 == 0).ToList();
```
- `ToList()` 호출 시점에 필터링이 즉시 실행되고 결과가 `List<int>`로 저장됩니다.

---

## 4. **IEnumerable와 List의 차이점**

| 구분           | IEnumerable<T>                     | List<T>                            |
|----------------|------------------------------------|------------------------------------|
| **실행 방식**  | 지연 실행 (연산은 필요할 때 수행) | 즉시 실행 (데이터를 메모리에 저장) |
| **데이터 저장**| 데이터 저장 없음 (실시간 연산)    | 데이터를 메모리에 저장             |
| **재사용성**   | 연산 시마다 다시 계산             | 이미 저장된 결과를 재사용          |
| **성능**       | 메모리 효율적                     | 연산 이후 접근 속도 빠름            |

---

## 5. **종합 예제**

아래는 `OrderBy`, `Where`, `ToList` 메서드가 조합된 예제입니다.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main()
    {
        int[] arr = { 5, 1, 4, 2, 3 };

        var sortedEvenNumbers = arr
            .OrderBy(v => v)              // 정렬
            .Where(v => v % 2 == 0)       // 짝수 필터링
            .ToList();                    // 즉시 실행 및 List 변환

        sortedEvenNumbers.ForEach(v => Console.WriteLine(v)); // 결과 출력

        // int[] arr = { 30, 56, 78, 45, 12, 99, 33 };

        // IEnumerable<int> sub1 = arr.OrderBy((v) => v);
        // IEnumerable<int> sub2 = sub1.Where((v) => v % 2 == 0);
        // List<int> lt = sub2.ToList();

        // lt.ForEach((v) => { Console.WriteLine(v); });
    }
}
```

**실행 결과**:
```
2
4
```

**설명**:
1. `OrderBy`로 배열을 오름차순 정렬합니다.
2. `Where`로 짝수만 필터링합니다.
3. `ToList()`로 결과를 즉시 실행하고 `List<int>`로 변환합니다.
4. `ForEach`를 사용해 결과를 출력합니다.

---

## 6. **결론**
LINQ 메서드는 데이터를 정렬(`OrderBy`), 필터링(`Where`), 변환(`ToList`)하는 기능을 제공하며, 지연 실행과 즉시 실행의 개념을 이해하는 것이 중요합니다. 지연 실행은 메모리 효율적이지만 반복 연산 시 성능 저하가 발생할 수 있고, 즉시 실행은 메모리를 사용하지만 결과를 빠르게 재사용할 수 있습니다.

`yield return`은 LINQ의 지연 실행과 유사한 방식으로 데이터를 순차적으로 반환하여 메모리 사용을 최소화할 수 있습니다. LINQ를 효과적으로 사용하기 위해서는 `IEnumerable`와 `List`의 차이점, 각 메서드의 동작 방식, 실행 시점을 명확히 이해해야 합니다.

