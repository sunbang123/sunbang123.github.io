---
layout: post
title: "Windows 가상 메모리와 C# Thread·Task 이해하기"
date: 2024-11-19 18:07:28 +0900
last_modified_at: 2026-07-24 00:00:00 +0900
categories: Process
tags: [Csharp, computer-science, threading]
description: Windows 가상 메모리의 Reserve·Commit 상태와 C#의 값·참조 타입, Thread와 Task, Blocking과 비동기 I/O의 차이를 함께 정리합니다.
experience_note: Windows와 .NET의 메모리·동시성 개념을 한 문서에서 섞어 적었던 학습 노트를 공식 문서 기준으로 다시 구분해 정리했습니다.
---

메모리, 스레드, `Task`는 모두 프로그램 실행과 관련되지만 서로 다른 층의 개념이다. 예전 학습 노트에서는 이 항목들을 한데 적어 두어 경계가 모호했다. 여기서는 먼저 Windows의 가상 메모리 상태를 확인하고, 그 위에서 동작하는 .NET 타입과 동시성 모델을 구분한다.

## 물리 메모리와 가상 주소 공간

물리 메모리는 컴퓨터에 장착된 RAM이다. 반면 프로세스가 코드에서 사용하는 주소는 운영체제가 제공하는 **가상 주소**다. 각 프로세스는 독립된 가상 주소 공간을 보고, 운영체제가 그 주소를 RAM이나 페이지 파일의 저장 공간과 연결한다.

32비트 주소가 표현할 수 있는 이론적 범위는 `2^32`바이트, 즉 4GiB다. 64비트 주소의 이론적 범위는 훨씬 크지만 실제 프로세스가 사용할 수 있는 범위는 CPU와 운영체제, 프로세스 설정의 제한을 받는다. 따라서 “64비트 프로세스는 항상 특정 용량을 모두 쓸 수 있다”라고 단정하면 안 된다.

Windows에서 가상 메모리 페이지의 상태는 다음처럼 구분할 수 있다.

| 상태 | 의미 | 바로 읽기/쓰기 가능한가 |
|---|---|---|
| Free | 아직 주소 범위가 할당되지 않은 상태 | 아니요 |
| Reserved | 주소 범위만 선점하고 물리 저장 공간은 연결하지 않은 상태 | 아니요 |
| Committed | RAM 또는 페이지 파일에 뒷받침될 저장 공간이 보장된 상태 | 보호 속성에 따라 가능 |

`Reserve`는 큰 연속 주소 범위를 먼저 확보하고 나중에 필요한 부분만 `Commit`할 때 유용하다. `Decommit`은 저장 공간을 돌려주되 주소 범위는 예약 상태로 남길 수 있고, `Release`는 예약한 주소 범위 자체를 다시 Free 상태로 반환한다. 이 구분은 Windows의 [`VirtualAlloc`](https://learn.microsoft.com/windows/win32/api/memoryapi/nf-memoryapi-virtualalloc) 계열 API를 이해할 때 특히 중요하다.

프로세스의 가상 주소 공간에는 보통 실행 코드, 정적 데이터, 힙, 스택 등이 배치된다. 힙은 객체와 동적 데이터가 주로 놓이는 영역이고, 각 스레드의 스택은 호출 프레임과 지역 상태를 관리한다. 실제 배치는 런타임과 최적화에 따라 달라질 수 있으므로 “모든 값 타입은 스택, 모든 참조 타입은 힙”처럼 외우는 것은 정확하지 않다.

## C# 값 타입과 참조 타입

| 구분 | 예 | 변수에 들어 있는 것 |
|---|---|---|
| 값 타입 | `int`, `bool`, `enum`, `struct` | 값 자체 |
| 참조 타입 | `object`, `string`, `class`, `delegate`, `interface` | 객체를 가리키는 참조 |

값 타입 변수를 다른 변수에 대입하면 값이 복사된다. 참조 타입 변수를 대입하면 두 변수가 같은 객체를 가리킬 수 있다. 다만 값 타입도 클래스의 필드나 박싱된 값처럼 힙에 포함될 수 있고, 참조 타입의 지역 변수에 담긴 참조는 스택 프레임에서 관리될 수 있다. 타입의 분류와 실제 저장 위치는 별개의 질문이다.

### struct 값 타입의 데이터 구조

<img src="/post_img/1119/image1.png" width="500px" alt="C# struct와 int 값 타입의 복사 구조">

사용자 정의 `struct`와 `int`는 값 타입이다. 큰 구조체를 잦게 복사하면 비용이 커질 수 있으므로, 불변 구조체나 `in` 매개변수처럼 복사 의도를 드러내는 방법을 상황에 맞게 검토한다.

### class 참조 타입의 데이터 구조

<img src="/post_img/1119/image2.png" width="500px" alt="C# class 인스턴스와 참조 변수의 연결 구조">

`class` 인스턴스는 보통 `new`로 생성하며 변수에는 객체 자체가 아니라 객체를 가리키는 관리되는 참조가 저장된다. 이 참조는 C/C++의 원시 포인터와 달리 가비지 컬렉터가 추적하고 이동을 고려해 관리한다.

## Blocking과 비동기 작업

**Blocking**은 작업이 끝날 때까지 현재 스레드가 다음 일을 진행하지 못하고 기다리는 상태다. 예를 들어 `Task.Result`, `Task.Wait()` 또는 동기 파일·네트워크 API는 호출 스레드를 점유한 채 완료를 기다릴 수 있다.

**비동기 I/O**는 기다리는 동안 호출 스레드를 반환하고, 작업이 완료되면 이어서 실행할 코드를 예약한다. C#의 `await`는 이 흐름을 읽기 쉬운 코드로 표현한다.

```csharp
// 호출 스레드를 막을 수 있는 동기 대기
string text = httpClient.GetStringAsync(url).Result;

// I/O가 끝날 때까지 스레드를 점유하지 않는 비동기 대기
string text = await httpClient.GetStringAsync(url);
```

`async`라고 해서 언제나 새 스레드가 생기는 것은 아니다. 네트워크나 파일 I/O는 운영체제의 완료 알림을 이용할 수 있고, CPU 연산을 병렬로 실행해야 할 때는 `Task.Run`이나 병렬 API가 스레드 풀을 사용할 수 있다. UI와 서버 코드에서는 동기 대기로 인한 교착이나 스레드 풀 고갈을 피하기 위해 호출 경로 전체에 `async`/`await`를 이어 주는 것이 중요하다.

## Thread와 Task의 역할

`System.Threading`은 `Thread`, `ThreadPool`, `Mutex`, `Semaphore`, `Monitor`, 이벤트 계열 동기화 도구처럼 스레드와 동기화의 저수준 구성 요소를 제공한다.

`System.Threading.Tasks`의 `Task`는 “언젠가 완료될 작업”을 나타내는 더 높은 수준의 추상화다. 기본 스케줄러는 필요할 때 .NET 스레드 풀을 사용하고, 취소·연속 작업·예외 전파·결과 반환을 일관된 API로 다룬다.

- `Task`: 결과 값 없이 완료 여부를 나타내는 작업
- `Task<T>`: 완료 후 `T` 형식의 결과를 제공하는 작업
- `TaskScheduler`: 작업을 어디에서 어떻게 실행할지 결정하는 확장 지점
- `CancellationToken`: 협력적인 취소 요청을 전달하는 값

직접 수명과 우선순위를 제어해야 하는 전용 작업이 아니라면 `Thread`를 바로 만드는 것보다 `Task`와 `async`/`await`를 먼저 검토하는 편이 일반적이다. 다만 CPU 병렬 처리와 I/O 비동기는 목적이 다르므로, 단순히 모든 코드를 `Task.Run`으로 감싸는 것은 해결책이 아니다.

## 참고 자료

- [Microsoft Learn: Page State](https://learn.microsoft.com/windows/win32/memory/page-state)
- [Microsoft Learn: Task-based asynchronous programming](https://learn.microsoft.com/dotnet/standard/parallel-programming/task-based-asynchronous-programming)
- [Microsoft Learn: Task Parallel Library](https://learn.microsoft.com/dotnet/standard/parallel-programming/task-parallel-library-tpl)
