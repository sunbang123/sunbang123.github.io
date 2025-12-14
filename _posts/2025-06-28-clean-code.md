---
layout: post
title: "Clean code"
date: 2025-06-28 10:14:46 +0900
categories: 
tags: [ "Programming", "Code-Patterns", "Software-Development" ]
---

# 좋은 개발자가 자주 쓰는 코드 구문 8가지

프로그래밍에서 "좋은 코드"는 단순히 동작하는 것만을 의미하지 않습니다. 읽기 쉽고, 유지보수하기 쉬우며, 다른 사람과 협업할 때도 혼란이 없는 코드가 바로 좋은 코드죠.

그렇다면 좋은 개발자는 실제로 코드 안에서 어떤 문장들을 자주 쓸까요? 단순한 문법이지만, 그 쓰임새와 맥락에는 많은 고민과 노하우가 담겨 있습니다.

오늘은 좋은 개발자가 자주 쓰는 8가지 코드 구문을 소개해 드릴게요.

## 1. if 조건문 — 분기 처리의 기본

```csharp
if (isValid)
{
    SaveData();
}
```

조건문은 코드의 흐름을 분기할 때 가장 자주 쓰입니다. 좋은 개발자는 복잡한 조건을 단순하게 정리하고, 가독성이 높은 방식으로 조건문을 구성합니다.

> 💡 "조건문이 많을수록 로직이 복잡해지니, 최대한 명확하게!"

## 2. foreach 반복문 — 컬렉션 처리에 강력한 도구

```csharp
foreach (var item in items)
{
    Process(item);
}
```

반복문 중에서도 foreach는 가독성과 안정성이 높아 자주 사용됩니다. 개발자는 리스트나 배열을 순회하면서 데이터 처리, 렌더링, 검증 등의 작업을 수행하죠.

> 💡 "인덱스를 굳이 쓸 필요가 없다면, foreach!"

## 3. 함수 호출 — 책임을 분리하고 재사용하기

```csharp
ValidateInput(userInput);
```

함수는 좋은 개발자의 대표적인 도구입니다. 역할별로 코드를 분리하면, 코드는 짧아지고 테스트도 쉬워지며 버그도 줄어듭니다.

> 💡 "하나의 함수는 하나의 일만 하게!" (SRP)

## 4. 인터페이스 (interface) — 유연한 설계의 핵심

```csharp
public interface ILogger
{
    void Log(string message);
}
```

좋은 개발자는 구현보다 역할에 의존하는 코드를 선호합니다. interface는 의존성 주입, 테스트, 유지보수에 강력한 유연성을 줍니다.

> 💡 "구체적인 클래스보다 추상화에 의존하라 (DIP 원칙)"

## 5. return, continue, break — 흐름을 단순하게

```csharp
if (!isReady) return;
```

조기 반환(early return)은 중첩을 줄이고, 코드를 간결하게 유지합니다. 루프 안에서도 조건이 맞지 않으면 바로 continue나 break를 사용하는 습관이 중요합니다.

> 💡 "복잡한 if문보다는 빠른 탈출로 깔끔하게!"

## 6. null 체크와 옵셔널 처리

```csharp
if (user != null)
{
    user.DoSomething();
}
```

혹은 C#처럼 지원한다면:

```csharp
user?.DoSomething();
```

null로 인한 예외는 실무에서 매우 흔한 오류입니다. 좋은 개발자는 항상 null 가능성을 염두에 두고 안정적인 코드를 작성합니다.

> 💡 "null-safe는 기본 중의 기본!"

## 7. 선언형 프로그래밍 (LINQ / stream)

```csharp
var names = users.Where(u => u.IsActive).Select(u => u.Name);
```

루프보다 더 읽기 쉬운 선언적 코드는 실력 있는 개발자의 특징입니다. 특히 C#의 LINQ, JavaScript의 map/filter, Java의 stream 등은 깔끔한 로직 구현에 매우 유용하죠.

> 💡 "코드는 영어 문장처럼 읽혀야 한다!"

## 8. try-catch 예외 처리

```csharp
try
{
    SaveToFile();
}
catch (Exception ex)
{
    logger.Log(ex.Message);
}
```

예외 처리는 실패 가능성이 있는 모든 코드에 필요합니다. 좋은 개발자는 오류를 무시하지 않고, 예외를 명확하게 처리합니다.

> 💡 "실패할 수 있는 곳은 항상 실패한다. 대비하자."

## 마무리: 단순함이 강함이다

좋은 개발자가 쓰는 코드는 결코 화려하지 않습니다. 오히려 단순하고, 명확하며, 읽기 쉬운 코드일 뿐입니다.

오늘 소개한 코드 구문들처럼, 작지만 강력한 도구들을 잘 활용하면 여러분의 코드도 더 나아질 수 있습니다.

---

✍️ 이 글이 도움이 되셨다면 댓글이나 좋아요로 응원해주세요!  
혹시 팀에서 자주 쓰는 스타일이나 패턴이 있다면 공유해 주셔도 좋습니다 😊