---
layout: post
title: "C# programming guide"
date: 2024-12-18 06:33:16 +0900
categories: 
tags: 
---

# C# 프로그래밍 완벽 가이드

## 목차
1. [인터페이스와 컬렉션](#1-인터페이스와-컬렉션)
2. [기본 프로그래밍 개념](#2-기본-프로그래밍-개념)
3. [스레딩의 기본 구조](#3-스레딩의-기본-구조)
4. [고급 스레딩 개념](#4-고급-스레딩-개념)
5. [Task와 비동기 프로그래밍](#5-task와-비동기-프로그래밍)
6. [현대적 프로그래밍 기능](#6-현대적-프로그래밍-기능)
7. [LINQ와 컬렉션 처리](#7-linq와-컬렉션-처리)

## 1. 인터페이스와 컬렉션

### IEnumerable과 IEnumerator 인터페이스 구현
```csharp
class Points : IEnumerable, IEnumerator
{
    List<Point> points = new List<Point>();
    int index = -1;

    public object Current => points[index];
    
    public IEnumerator GetEnumerator()
    {
        Reset();
        return this;
    }

    public bool MoveNext()
    {
        return ++index < points.Count;
    }
}
```

### 컬렉션 정렬을 위한 IComparer 구현
```csharp
class PointCompare : IComparer
{
    public int Compare(object x, object y)
    {
        Point a = (Point)x;
        Point b = (Point)y;
        return a.X - b.X;
    }
}
```

### 객체 복제를 위한 ICloneable 구현
```csharp
class Point : ICloneable
{
    public object Clone()
    {
        return MemberwiseClone();  // 얕은 복사
    }
    
    // 또는 깊은 복사
    public Point Clone()
    {
        return new Point(X, Y);
    }
}
```

### LINQ 활용
```csharp
int[] arr = { 30, 56, 78, 45, 12, 99, 33 };
arr.OrderBy(v => v)
   .Where(v => v % 2 == 0)
   .ToList()
   .ForEach(v => Console.WriteLine(v));
```

### 주요 특징
- 컬렉션의 반복 동작 구현 (IEnumerable/IEnumerator)
- 사용자 정의 정렬 구현 (IComparer)
- 객체 복제 메커니즘 (얕은 복사/깊은 복사)
- LINQ를 통한 데이터 처리
- 참조 타입의 복사와 참조 비교
- yield return을 통한 이터레이터 구현

## 2. 기본 프로그래밍 개념

### 델리게이트와 제네릭 델리게이트
```csharp
// 기본 델리게이트 선언
delegate void PrintDel(int data);

// 제네릭 델리게이트 사용
Action<int> action = x => Console.WriteLine(x);
Func<int, int> func = x => x * x;
```

### 제네릭 메서드와 클래스
```csharp
// 제네릭 메서드
static void Print<T>(T data)
{
    Console.WriteLine($"data: {data}");
}

// 제네릭 클래스
class Stack<T>
{
    List<T> lt = new List<T>();
    public void Push(T data) { lt.Add(data); }
    public T Pop() { /* ... */ }
}
```

### 참조 매개변수(ref, out)
```csharp
// ref 매개변수
static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

// out 매개변수
static void Add(int a, int b, out int result)
{
    result = a + b;
}
```

### 람다식과 익명 함수
```csharp
Func<int, int> del = a => a * a;
Action<int> print = x => Console.WriteLine(x);
```

### 컬렉션과 제네릭 컬렉션
```csharp
List<int> lt = new List<int>();
lt.Add(10);
lt.Add(20);
lt.Add(30);
```

## 3. 스레딩의 기본 구조

### 기본 스레드 생성과 실행
```csharp
Thread t = new Thread(new ThreadStart(PrintInteger));
t.Start();

static void PrintID()
{
    Console.Write($"[{Thread.CurrentThread.ManagedThreadId}]");
}
```

### 변수 공유와 스레드 스코프
```csharp
// 지역변수 버전 - 각 스레드가 독립적인 i를 가짐
static void PrintInteger()
{
    for (int i = 0; i < 10; ++i) { ... }
}

// 전역변수 버전 - 모든 스레드가 같은 i를 공유
static int i;
static void PrintInteger()
{
    for (i = 0; i < 10; ++i) { ... }
}
```

### 이벤트 시스템 구현
```csharp
class IndexEventArgs : EventArgs
{
    public int Index { get; set; }
    public int Data { get; set; }
}

class Server
{
    public event EventHandler<IndexEventArgs> TestEvent;
    
    public void PrintArray()
    {
        if (rand.Next(5) == 1)
            TestEvent(this, new IndexEventArgs(i, arr[i]));
    }
}
```

## 4. 고급 스레딩 개념

### 스레드 동기화와 락
```csharp
static int count = 0;
static object key = new object();

static void ThreadFunc(object param)
{
    for (int i = 0; i < 1_000_000; ++i)
        lock (key)  // 임계 영역 보호
        {
            ++count;
        }
}
```

### 파라미터화된 스레드
```csharp
Thread t1 = new Thread(new ParameterizedThreadStart(ThreadFunc));
t1.Start("100");  // 문자열 파라미터 전달
```

### 스레드 타입과 데이터 공유
```csharp
class ThreadData
{
    public int Start { get; set; }
    public int End { get; set; }
    public DataResult DataResult { get; set; }
}

DataResult dr = new DataResult();
t1.Start(new ThreadData(1, 100, dr));
t2.Start(new ThreadData(101, 200, dr));
```

## 5. Task와 비동기 프로그래밍

### Task와 async/await 패턴
```csharp
static async Task<int> TotalInteger(int s, int e)
{
    await Task.Delay(1000);
    return await Task.Run(() => {
        int sum = 0;
        for (int i = s; i <= e; i++) 
            sum += i;
        return sum;
    });
}

Task<int> t1 = TotalInteger(1, 10);
await t1;  // 또는 Task.WaitAll(t1);
```

### Task 병렬 처리와 동기화
```csharp
int sum = 0;
object key = new object();

Task[] tasks = new Task[10];
for (int i = 0; i < 10; ++i)
{
    tasks[i] = Task.Run(() => {
        lock (key) {
            sum += j;
        }
    });
}

Task.WaitAll(tasks);
```

### Task 대기 메커니즘
```csharp
// 개별 Task 대기
t1.Wait();

// 여러 Task 동시 대기
Task.WaitAll(t1, t2, t3);
Task waitTask = Task.WhenAll(t1, t2);
```

## 6. 현대적 프로그래밍 기능

### LINQ와 확장 메서드
```csharp
static class MyClass
{
    public static void Print<T>(this IEnumerable<T> cont)
    {
        foreach (var item in cont)
            Console.Write($"{item} ");
        Console.WriteLine();
    }
}

// LINQ 사용
IEnumerable<int> subset = Enumerable.Range(1, 100);
subset.Where(v => v % 5 == 0)
      .OrderByDescending(v => v)
      .Select(v => v + 20)
      .Print();
```

### 람다식과 델리게이트
```csharp
Action f1 = () => { Console.WriteLine("Hello f1()"); };
Func<int, int, int> f3 = (a, b) => a + b;

// LINQ에서의 람다
arr.Where(v => v % 2 == 0);
```

### var와 익명 타입
```csharp
// var 키워드
var value = 100;

// 익명 타입
var obj = new { A = 10, B = "Hello" };
```

## 7. LINQ와 컬렉션 처리

### LINQ 기본 연산자
```csharp
// Skip과 Take
var subset = arr.Skip(5).Take(3);  // 5개 건너뛰고 3개 선택

// Where와 Select
var query = arr.Where(x => x % 2 == 0)      // 조건 필터링
               .Select(x => x * 2);          // 데이터 변환

// 집계 함수
int count = arr.Count();
int max = arr.Max();
int min = arr.Min();
```

### 컬렉션과 객체 쿼리
```csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Phone { get; set; }
}

// 객체 컬렉션 쿼리
var result = lt.Where(person => person.Name.Contains("길"))
               .Select(person => new { 
                   Index = index++, 
                   Age = person.Age 
               });
```

### LINQ 쿼리 작업
- 필터링 (Where)
- 정렬 (OrderByDescending)
- 변환 (Select)
- 데이터 검증 (Any, All, Contains)
- 데이터 집계 (Count, Sum, Max, Min)

### 주요 특징
- LINQ를 통한 데이터 쿼리 및 변환
- async/await를 사용한 비동기 프로그래밍
- 확장 메서드를 통한 기능 확장
- 람다식을 통한 함수형 프로그래밍
- Parallel 클래스를 통한 병렬 처리
- Task를 사용한 비동기 작업 관리
- 컬렉션과 제네릭을 활용한 타입 안정성