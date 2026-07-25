---
layout: post
title: "정보처리기사 실기 개념 복습: 형상관리·UML·테스트를 예제로 구분하기"
date: 2025-03-01 21:49:19 +0900
last_modified_at: 2026-07-25 00:00:00 +0900
categories:
tags: ["Certification", "정보처리기사"]
description: 형상관리와 빌드 도구, Bridge·Observer 패턴, UML 관계, 동등 분할·경계값 분석을 명령과 C# 예제로 구분해 설명합니다.
experience_note: 시험 대비 메모에 한 줄 정의로 섞여 있던 형상관리·UML·테스트 용어를 공식 문서와 작은 예제에 대입해 다시 정리한 학습 기록입니다.
---

이 글은 특정 회차의 문제와 정답을 다시 싣는 자료가 아니다. 기존 시험 대비 메모에서 서로 비슷해 보였던 용어를 골라, **어떤 문제를 해결하는 개념인지**와 **작은 예제에서 어떻게 확인하는지**를 중심으로 다시 정리했다.

암기 문장은 빠르게 복습할 때 유용하지만, 적용 범위를 구분하지 못하면 `Git`, `Gradle`, `Jenkins`, `OLTP`를 같은 종류의 도구로 오해하기 쉽다. 먼저 각 개념이 개발 과정의 어느 지점에 있는지부터 나눈다.

## 1. 형상관리, 버전관리, 변경관리는 같은 말이 아니다

소프트웨어 형상관리(Configuration Management)는 소스 코드만 다루지 않는다. 요구사항 문서, 설계서, 테스트 자료, 빌드 설정, 배포 산출물처럼 제품을 재현하는 데 필요한 **형상 항목**을 식별하고, 승인된 변경을 반영하며, 상태를 기록하고, 결과를 감사하는 활동까지 포함한다.

버전관리와 변경관리는 그 안에서 서로 다른 질문을 담당한다.

| 구분 | 답하려는 질문 | 예시 |
|---|---|---|
| 버전관리 | 무엇이 언제 어떻게 달라졌는가? | 커밋 이력, 태그, 브랜치, 파일 차이 |
| 변경관리 | 이 변경을 왜 요청했고 누가 검토·승인했는가? | 변경 요청서, 영향 분석, 승인 기록 |
| 형상관리 | 어떤 항목을 어떤 기준선으로 묶고 변경·상태·무결성을 어떻게 관리할 것인가? | 소스, 문서, 빌드 설정, 릴리스 산출물 관리 |

따라서 `변경 < 버전 < 형상`처럼 크기만 외우기보다 각 활동의 **대상과 책임**을 구분하는 편이 정확하다.

시험 메모에서는 형상 식별 → 형상 통제 → 형상 감사 → 형상 기록을 `식통감기`로 묶어 외우기도 한다. 다만 실무의 기록과 상태 보고는 마지막에 한 번만 하는 작업이 아니라 변경 과정 전체에서 계속 이어진다.

### 단계별로 남아야 하는 결과

1. **형상 식별**: 관리할 항목과 버전 규칙, 기준선을 정한다.
2. **형상 통제**: 변경 요청을 검토하고 승인된 변경만 기준선에 반영한다.
3. **형상 감사**: 승인 내용과 실제 산출물이 일치하며 기준선이 온전한지 확인한다.
4. **형상 기록·상태 보고**: 변경 이력과 현재 상태를 이해관계자가 추적할 수 있게 남긴다.

전자정부 표준프레임워크의 형상관리 가이드도 소스 버전관리 도구를 전체 형상관리 가운데 소스와 버전관리에 범위를 한정한 도구로 설명한다. 즉 Git을 쓴다고 해서 변경 승인, 빌드 재현성, 릴리스 감사까지 자동으로 끝나는 것은 아니다.

## 2. 도구 이름보다 담당 범위를 구분하기

| 항목 | 분류 | 핵심 역할 |
|---|---|---|
| CVS, Subversion(SVN) | 중앙집중형 버전관리 | 중앙 저장소를 기준으로 파일 버전과 변경 이력 관리 |
| Git | 분산형 버전관리 | 각 복제본이 이력을 가지며 브랜치·병합·커밋을 로컬에서도 수행 |
| Ant | 빌드 자동화 | XML 빌드 파일에 작업 순서 정의 |
| Maven | 빌드·의존성 관리 | POM을 기준으로 프로젝트 구조와 의존성·빌드 생명주기 관리 |
| Gradle | 빌드 자동화 | Groovy DSL과 Kotlin DSL을 지원하는 작업 기반 빌드 |
| Jenkins | 자동화 서버 | 빌드, 테스트, 전달, 배포 단계를 Pipeline으로 연결 |
| OLTP | 데이터 처리 방식 | 짧고 빈번한 트랜잭션을 일관성 있게 처리 |
| OLAP | 데이터 처리 방식 | 많은 데이터를 집계·분석해 의사결정을 지원 |

Gradle을 단순히 “Groovy 기반 도구”, Jenkins를 “배포 도구”라고만 외우면 현재 사용 범위를 놓친다. Gradle 공식 문서는 `.gradle`의 Groovy DSL과 `.gradle.kts`의 Kotlin DSL을 모두 설명하고, Jenkins 공식 문서는 Jenkins를 빌드·테스트·전달·배포 작업을 자동화하는 서버로 정의한다.

## 3. 버전관리 용어를 실제 Git 동작에 연결하기

`check out`, `check in`, `trunk`, `branch`는 모든 버전관리 제품에서 같은 명령으로 동작하는 단어가 아니다.

- **Check-out**은 저장소의 파일이나 작업 사본을 가져오는 작업을 가리킨다. Git에는 `git checkout` 명령도 있지만, 현재는 브랜치 전환에 `git switch`, 파일 복원에 `git restore`를 나눠 쓸 수 있다.
- **Check-in**은 변경을 저장소에 반영한다는 일반 용어다. Git에는 `git check-in` 명령이 없고 `add`, `commit`, 필요하면 `push`가 서로 다른 단계를 담당한다.
- **Trunk**는 Subversion 같은 중앙집중형 저장소에서 주 개발선을 부르던 구조 이름이다.
- **Branch**는 독립적인 변경 흐름을 가리킨다. Git에서는 커밋을 가리키는 이동 가능한 참조로 구현된다.

### `git diff`는 충돌이 날 때만 쓰는 명령이 아니다

다음 세 명령은 모두 차이를 보여 주지만 비교 대상이 다르다.

```bash
git diff
git diff --staged
git diff HEAD^ HEAD
```

| 명령 | 비교 대상 | 확인 시점 |
|---|---|---|
| `git diff` | 작업 트리 ↔ 스테이징 영역(index) | 아직 `git add`하지 않은 변경 검토 |
| `git diff --staged` | 스테이징 영역 ↔ `HEAD` | 다음 커밋에 들어갈 변경 검토 |
| `git diff HEAD^ HEAD` | 이전 커밋 ↔ 현재 커밋 | 방금 완료한 커밋의 변경 검토 |

예를 들어 `app.conf`의 `version=1`을 `version=2`로 바꾸면 처음에는 `git diff`에 보인다. `git add app.conf`를 실행한 뒤에는 일반 `git diff`에서는 사라지고 `git diff --staged`에 나타난다. 이 차이를 이해하면 “diff는 충돌 해결 도구”라는 좁은 정의에서 벗어나 커밋 전 검토 도구로 사용할 수 있다.

새 브랜치를 만들면서 바로 이동하려면 다음처럼 실행한다.

```bash
git switch -c feature/update-config
```

## 4. Bridge와 Observer는 무엇을 분리하는가

두 패턴은 모두 결합도를 낮추지만 분리하는 대상이 다르다.

### Bridge: 추상화와 구현을 독립적으로 바꾸기

알림의 종류가 `일반 알림`, `긴급 알림`이고 전송 방식이 `이메일`, `SMS`라면 모든 조합마다 하위 클래스를 만드는 순간 클래스 수가 늘어난다.

Bridge에서는 `Notification`이 **추상화 계층**, `IMessageSender`가 **구현 계층**을 맡는다. `UrgentNotification`은 메시지 앞에 긴급 표시를 붙이는 책임에 집중하고, 실제 전송은 생성자로 받은 `EmailSender`나 `SmsSender`에 위임한다. 그러면 알림 종류와 전송 방식이 서로 독립적으로 확장된다.

```csharp
using System;

public interface IMessageSender
{
    void Send(string message);
}

public sealed class EmailSender : IMessageSender
{
    public void Send(string message) =>
        Console.WriteLine($"Email: {message}");
}

public abstract class Notification
{
    protected Notification(IMessageSender sender) => Sender = sender;
    protected IMessageSender Sender { get; }
    public abstract void Notify(string message);
}

public sealed class UrgentNotification : Notification
{
    public UrgentNotification(IMessageSender sender) : base(sender) { }

    public override void Notify(string message) =>
        Sender.Send($"[URGENT] {message}");
}

public static class Program
{
    public static void Main()
    {
        var notification = new UrgentNotification(new EmailSender());
        notification.Notify("빌드 실패");
    }
}
```

예상 출력은 `Email: [URGENT] 빌드 실패`다. `SmsSender`를 추가해도 `UrgentNotification`은 수정할 필요가 없다.

### Observer: 한 객체의 변화를 여러 구독자에게 알리기

Observer는 한 객체의 상태가 바뀔 때 그 객체에 의존하는 구독자에게 변경을 알리는 일대다 관계를 만든다. .NET의 `event`를 사용하면 이 흐름을 작게 확인할 수 있다.

```csharp
using System;

var sensor = new TemperatureSensor();

sensor.Changed += value => Console.WriteLine($"화면 갱신: {value}℃");
sensor.Changed += value => Console.WriteLine($"로그 저장: {value}℃");
sensor.SetValue(27);

public sealed class TemperatureSensor
{
    public event Action<int>? Changed;

    public void SetValue(int value) => Changed?.Invoke(value);
}
```

`TemperatureSensor`는 화면이나 로그 클래스의 구체적인 타입을 알지 못한다. 구독자가 이벤트에 등록하고 해제할 책임을 가진다는 점도 함께 기억해야 한다.

## 5. UML 관계를 선 모양과 수명 규칙으로 구분하기

UML은 단순히 “클래스를 연결하는 그림”이 아니라 모델 요소 사이의 의미를 정해진 표기법으로 전달하는 언어다.

| 관계 | 표기 | 의미 | 예 |
|---|---|---|---|
| 일반화(Generalization) | 실선 + 빈 삼각형 | 하위 타입이 상위 타입의 한 종류임 | `Dog` → `Animal` |
| 실체화(Realization) | 점선 + 빈 삼각형 | 클래스가 인터페이스의 계약을 구현함 | `EmailSender` → `IMessageSender` |
| 연관(Association) | 실선 | 객체 사이에 구조적인 연결이 있음 | `Customer` — `Order` |
| 의존(Dependency) | 점선 화살표 | 한 요소의 변화가 다른 요소에 영향을 줄 수 있는 사용 관계 | 메서드 매개변수로 `Logger` 사용 |
| 집약(Aggregation) | 전체 쪽 빈 마름모 | 부분을 공유할 수 있는 약한 전체–부분 관계 | `Playlist` ◇— `Song` |
| 합성(Composition) | 전체 쪽 채운 마름모 | 부분이 동시에 둘 이상의 전체에 속할 수 없는 강한 소유 관계 | `Order` ◆— `OrderLine` |

집약과 합성을 단순히 “전체가 없어질 때 부분도 메모리에서 삭제되는가”로만 판단하면 구현 언어의 가비지 컬렉션과 UML 모델 의미를 혼동하게 된다. 특히 UML의 공유 집약은 의미가 약하므로, 공유 관계를 분명히 전달할 필요가 없다면 일반 연관을 사용하는 편이 더 명확할 수 있다.

### 유스케이스의 `include`와 `extend`

- **`include`**: 기본 유스케이스가 공통 동작을 항상 포함한다. 화살표는 기본 유스케이스에서 포함되는 유스케이스를 향한다.
- **`extend`**: 특정 조건에서만 기본 유스케이스에 동작을 추가한다. 화살표는 확장 유스케이스에서 확장되는 기본 유스케이스를 향한다.

예를 들어 `상품 주문`이 항상 `결제 검증`을 수행한다면 `include`가 맞다. `쿠폰 적용`이 쿠폰을 입력한 경우에만 주문 과정에 추가된다면 `extend`로 표현할 수 있다.

## 6. 테스트 기법은 같은 입력을 어떻게 나누는지로 이해하기

정수 나이를 받아 `0 이상 120 이하`만 유효하다고 판단하는 함수를 예로 들자.

```csharp
static bool IsValidAge(int age) => age is >= 0 and <= 120;
```

### 동등 분할

동일하게 처리될 것으로 기대되는 입력을 겹치지 않는 집합으로 나눈다.

| 분할 | 범위 | 대표값 | 예상 결과 |
|---|---:|---:|---|
| 유효하지 않은 낮은 값 | `age < 0` | `-10` | `false` |
| 유효한 값 | `0 <= age <= 120` | `30` | `true` |
| 유효하지 않은 높은 값 | `age > 120` | `130` | `false` |

모든 정수를 넣지 않고 각 분할의 대표값으로 같은 종류의 처리를 확인하는 것이 핵심이다.

### 경계값 분석

결함은 분할의 가운데보다 경계 주변에서 자주 발생한다. 이 예제의 경계값 집합은 다음과 같이 잡을 수 있다.

```text
-1, 0, 1, 119, 120, 121
```

아래 코드는 여섯 입력과 기대값을 한 번에 확인한다.

```csharp
using System;

var cases = new (int Age, bool Expected)[]
{
    (-1, false),
    (0, true),
    (1, true),
    (119, true),
    (120, true),
    (121, false)
};

foreach (var test in cases)
{
    var actual = IsValidAge(test.Age);
    Console.WriteLine(
        $"age={test.Age}, expected={test.Expected}, actual={actual}");
}

static bool IsValidAge(int age) => age is >= 0 and <= 120;
```

### 다른 블랙박스·경험 기반 기법

- **원인–결과 그래프**: 여러 입력 조건의 참·거짓 조합이 출력에 미치는 영향을 논리적으로 모델링한다.
- **오류 추정(Error Guessing)**: 과거 결함과 도메인 경험을 바탕으로 누락되기 쉬운 입력을 고른다. 체계적인 기법을 대체하기보다 보완한다.
- **비교 테스트**: 독립적으로 구현된 여러 시스템에 같은 입력을 주고 결과 차이를 찾는다. 운영 화면 두 버전의 반응을 비교하는 A/B 테스트와 목적이 다르다.

정적 테스트는 프로그램을 실행하지 않고 리뷰나 정적 분석으로 결함을 찾는다. 동적 테스트는 실행한 결과를 관찰한다. 블랙박스 테스트는 외부 동작과 명세에서 테스트를 만들고, 화이트박스 테스트는 코드 구조와 실행 경로를 기준으로 테스트한다.

## 7. Verification과 Validation

두 단어를 모두 “검증”으로 번역하면 목적 차이가 사라진다.

| 구분 | 핵심 질문 | 예 |
|---|---|---|
| Verification | 명세와 설계대로 올바르게 만들고 있는가? | 요구사항 리뷰, 코드 리뷰, 명세 기반 테스트 |
| Validation | 완성된 제품이 사용 목적과 사용자 필요를 충족하는가? | 실제 사용 시나리오 평가, 인수 테스트 |

명세에 `0~120`이라고 적혀 있고 코드도 정확히 그 범위를 구현했다면 verification은 통과할 수 있다. 그러나 실제 서비스가 신생아의 개월 수를 별도로 처리해야 하는데 정수 나이만 받는다면 사용자 목적에는 부족할 수 있다. 이때는 validation 관점에서 요구사항을 다시 살펴야 한다.

## 복습 체크

1. `git diff`와 `git diff --staged`는 각각 무엇을 비교하는가?
2. Gradle과 Jenkins를 같은 “배포 도구”로 묶으면 무엇을 놓치는가?
3. `Playlist–Song`과 `Order–OrderLine`의 소유 규칙은 어떻게 다른가?
4. 허용 범위가 `1~100`이라면 경계값 여섯 개는 무엇인가?
5. 명세대로 만들었지만 실제 사용자 문제를 해결하지 못한 제품은 어느 관점에서 실패한 것인가?

코드의 실행 흐름을 더 깊게 연습하려면 [C 함수 포인터와 Java 다형성 문제 풀이](/c-java-problem-solve/)와 [Enum·16진수 비트 연산 문제 풀이](/enum-and-16bit-problem-solve/)를 함께 볼 수 있다.

## 공식 참고 자료

- [전자정부 표준프레임워크: Configuration Management](https://www.egovframe.go.kr/docs/5.0/egovframe-development/configuration-management-tool/configuration-management/)
- [Git 공식 문서: git diff](https://git-scm.com/docs/git-diff)
- [Git 공식 문서: git switch](https://git-scm.com/docs/git-switch)
- [Git 공식 문서: git restore](https://git-scm.com/docs/git-restore)
- [Gradle 공식 문서: Kotlin DSL과 Groovy DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html)
- [Jenkins 공식 사용자 문서](https://www.jenkins.io/doc/)
- [Object Management Group: UML 2.5.1 명세](https://www.omg.org/spec/UML/)
- [ISTQB Certified Tester Foundation Level Syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf)
