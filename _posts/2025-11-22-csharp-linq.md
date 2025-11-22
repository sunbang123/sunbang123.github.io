---
layout: post
title: "C# LINQ"
date: 2025-11-22 23:13:00 +0900
categories: 
tags:  ["C#"]
---

# LINQ 집계(Aggregate) 함수: 게임 데이터 통계

게임을 개발할 때, 플레이어의 스탯, 몬스터의 능력치, 아이템의 가치 등 수많은 데이터의 평균값, 합계, 개수 등을 계산해야 할 필요가 있습니다. LINQ의 집계 함수는 이러한 통계 계산을 매우 간결하게 처리해 줍니다.

## 1\. Average (평균 계산)

`Average()`는 컬렉션 내의 숫자 값들의 **산술 평균**을 계산할 때 사용됩니다.

### 게임 개발 시나리오:

  * **팀 평균 전투력 계산:** 팀의 전반적인 강함을 파악합니다.
  * **아이템 평균 가격:** 시장이나 상점에서의 평균 거래 가격을 계산합니다.
  * **플레이 타임 평균:** 유저들의 평균 플레이 시간을 계산하여 콘텐츠 소비 속도를 파악합니다.

### 코드 예시:

```csharp
public class Unit
{
    public string Name { get; set; }
    public int AttackPower { get; set; }
}

List<Unit> partyMembers = new List<Unit>
{
    new Unit { Name = "Knight", AttackPower = 85 },
    new Unit { Name = "Archer", AttackPower = 60 },
    new Unit { Name = "Mage", AttackPower = 95 }
};

// 파티원들의 평균 공격력 계산
double averageAttack = partyMembers.Average(unit => unit.AttackPower);

// 결과: averageAttack = 80.0
```

-----

## 2\. Sum (합계 계산)

`Sum()`은 컬렉션 내의 숫자 값들을 \*\*모두 더한 값(합계)\*\*을 계산합니다.

### 게임 개발 시나리오:

  * **인벤토리 총 가치:** 인벤토리에 있는 모든 아이템의 가치 합계를 계산합니다.
  * **자원 총량:** 플레이어가 보유한 나무, 철광석 등의 자원 총량을 계산합니다.
  * **파티 총 체력:** 파티원 전체의 남은 체력 합계를 계산하여 위기 상황을 판단합니다.

### 코드 예시:

```csharp
public class Resource
{
    public string Type { get; set; }
    public int Quantity { get; set; }
}

List<Resource> playerResources = new List<Resource>
{
    new Resource { Type = "Wood", Quantity = 150 },
    new Resource { Type = "Stone", Quantity = 90 },
    new Resource { Type = "Gold", Quantity = 35 }
};

// 플레이어가 보유한 자원의 총 개수
int totalQuantity = playerResources.Sum(r => r.Quantity);

// 결과: totalQuantity = 275 (150 + 90 + 35)
```

-----

## 3\. Count / LongCount (개수 세기)

`Count()` 또는 `LongCount()`는 컬렉션 내의 **요소 개수**를 세거나, 특정 **조건을 만족하는 요소의 개수**를 셀 때 사용됩니다.

### 게임 개발 시나리오:

  * **활성 상태의 적:** 현재 화면이나 범위 내에 살아있는 적의 수를 세어 난이도를 동적으로 조절합니다.
  * **특정 버프를 가진 유닛:** "공격력 증가" 버프를 받은 유닛의 수를 세어 버프 효과를 관리합니다.
  * **미완료 퀘스트:** 플레이어가 진행 중인 퀘스트의 개수를 표시합니다.

### 코드 예시:

```csharp
public class Quest
{
    public string Title { get; set; }
    public bool IsCompleted { get; set; }
}

List<Quest> questLog = GetCurrentQuests();

// 1. 전체 퀘스트 개수
int totalQuests = questLog.Count();

// 2. 미완료 상태인 퀘스트의 개수 (Where 필터링과 동일한 효과)
int incompleteQuests = questLog.Count(q => q.IsCompleted == false);

// 결과 예시: totalQuests = 8, incompleteQuests = 3
```

-----

## 4. 성능 최적화 팁: `Count()` vs. `Any()`

앞서 언급했듯이, 게임 개발에서는 성능이 매우 중요합니다.

  * **`Count()`**: **정확한 개수**를 세야 할 때 사용합니다. 컬렉션 전체를 순회해야 합니다.
  * **`Any()`**: **"하나라도 존재하는지"** 여부만 확인할 때 사용합니다. 조건에 맞는 **첫 번째 요소**를 찾는 즉시 검색을 멈추기 때문에 **Count()보다 훨씬 빠릅니다.**

**존재 여부만 필요하다면, 반드시 `Any()`를 사용하세요.**

```csharp
// 비효율적: Count()를 0과 비교 (전체 순회 후 개수 확인)
if (enemies.Count(e => e.IsBoss) > 0)
{
    // ...
}

// 효율적: Any() 사용 (보스를 찾으면 즉시 중단)
if (enemies.Any(e => e.IsBoss))
{
    ShowBossWarningUI();
}
```

이러한 LINQ 집계 함수들을 활용하면, 데이터를 효과적으로 분석하고 게임 로직을 훨씬 간결하게 구현할 수 있습니다\!
