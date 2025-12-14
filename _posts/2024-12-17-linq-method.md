---
layout: post
title: "LINQ method"
date: 2024-12-17 19:07:03 +0900
categories: 
tags: 
---

# LINQ 메서드

LINQ는 C#에서 컬렉션 데이터를 쉽게 질의하고 조작하는 기능이다. 정렬, 필터링, 변환 등을 할 수 있다.

LINQ는 **지연 실행**과 **즉시 실행** 두 가지 방식으로 동작한다.

## 주요 메서드

### OrderBy - 정렬
```csharp
var sortedList = arr.OrderBy(v => v);
```
- 오름차순으로 정렬
- 반환: `IEnumerable<T>`
- **지연 실행**: 호출 시점에는 실행 안 됨, `foreach`나 `ToList()` 할 때 실행

### Where - 필터링
```csharp
var evenNumbers = arr.Where(v => v % 2 == 0);
```
- 조건에 맞는 요소만 필터링
- `v % 2 == 0` → 짝수만
- **지연 실행**: 실제 연산은 데이터 열거할 때 수행

### ToList - 즉시 실행
```csharp
var evenList = arr.Where(v => v % 2 == 0).ToList();
```
- `IEnumerable<T>`를 `List<T>`로 변환
- **즉시 실행**: 호출 시점에 바로 실행되어 메모리에 저장
- 재사용하거나 `ForEach` 같은 메서드 쓸 때 필요

## yield 키워드

`yield return`을 쓰면 데이터를 순차적으로 반환할 수 있다. 메모리 효율적!

```csharp
IEnumerable<int> GetEvenNumbers(int[] arr)
{
    foreach (var v in arr)
    {
        if (v % 2 == 0)
        {
            yield return v; // 짝수만 반환
        }
    }
}

var evenNumbers = GetEvenNumbers(new int[] { 1, 2, 3, 4, 5 });
foreach (var num in evenNumbers)
{
    Console.WriteLine(num);
}
```

**결과**:
```
2
4
```

**특징**:
- 컴파일러가 자동으로 `IEnumerable`과 `IEnumerator` 구현
- 데이터 요청할 때만 조건 검사 → 메모리 효율적
- `GetEnumerator` 메서드 자동 생성

## 지연 실행 vs 즉시 실행

### 지연 실행 (Deferred Execution)
- `OrderBy`, `Where` 등
- 데이터 열거할 때 연산 수행

**장점**: 메모리 효율적, 불필요한 연산 피함  
**단점**: 여러 번 열거하면 다시 계산

```csharp
var query = arr.Where(v => v % 2 == 0);
foreach (var item in query) // 이때 실제 필터링 수행
{
    Console.WriteLine(item);
}
```

### 즉시 실행 (Immediate Execution)
- `ToList()`, `ToArray()` 등
- 호출 시점에 바로 실행

**장점**: 한 번 계산하고 메모리에 저장, 재사용 시 빠름  
**단점**: 메모리 사용

```csharp
var result = arr.Where(v => v % 2 == 0).ToList(); // 즉시 실행
```

## IEnumerable vs List

| 구분 | IEnumerable<T> | List<T> |
|------|-----------------|---------|
| 실행 방식 | 지연 실행 | 즉시 실행 |
| 데이터 저장 | 저장 없음 (실시간 연산) | 메모리에 저장 |
| 재사용성 | 매번 다시 계산 | 저장된 결과 재사용 |
| 성능 | 메모리 효율적 | 접근 속도 빠름 |

## 종합 예제

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
            .OrderBy(v => v)        // 정렬
            .Where(v => v % 2 == 0) // 짝수 필터링
            .ToList();              // 즉시 실행 및 List 변환

        sortedEvenNumbers.ForEach(v => Console.WriteLine(v));
    }
}
```

**결과**:
```
2
4
```

## 정리

- LINQ는 지연 실행과 즉시 실행을 구분해서 써야 함
- 지연 실행: 메모리 효율적이지만 반복 연산 시 느림
- 즉시 실행: 메모리 쓰지만 재사용 시 빠름
- `yield return`은 지연 실행과 비슷하게 메모리 효율적으로 데이터 반환
