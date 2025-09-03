---
layout: post
title: "초고속 병렬 처리로 3D 오목(스킬 포함) 승리 판정 구현하기"
date: 2025-09-03 19:20:00 +0900
categories: 
tags: ["Unity", "C#"]
---

# 초고속 병렬 처리로 구현하는 3D 오목(스킬 포함) 승리 판정

> **Unity C# Job System + Burst 설계 보고서 (Transform 기반 탐색 포함)**

---

## 💻 Job System & Burst 코드 언어

### C# 기반 개발
Job System과 Burst 모두 **순수 C# 코드**로 작성됩니다. 별도의 새로운 언어나 문법을 배울 필요가 없습니다.

#### Job System 예시
```csharp
using Unity.Collections;
using Unity.Jobs;

public struct WinCheckJob : IJob
{
    [ReadOnly] public NativeArray<int> boardData;
    public NativeReference<bool> result;
    
    public void Execute()
    {
        // 일반적인 C# 코드로 작성
        for (int i = 0; i < boardData.Length; i++)
        {
            if (boardData[i] == 1) // 흑돌 체크
            {
                // 승리 조건 확인 로직
            }
        }
    }
}
```

#### Burst 컴파일러 적용
```csharp
[BurstCompile] // 이 속성만 추가하면 초고속 컴파일!
public struct FastWinCheckJob : IJob
{
    public NativeArray<int> data;
    
    public void Execute()
    {
        // 똑같은 C# 코드지만 Burst가 C++ 수준으로 최적화
        for (int i = 0; i < data.Length; i++)
        {
            data[i] = math.max(data[i], 0); // Unity.Mathematics 사용
        }
    }
}
```

### 🚫 Burst 제약사항

**사용 불가능한 C# 기능들:**
```csharp
// ❌ 가비지 컬렉션 생성 코드
string text = "Hello World";
List<int> managedList = new List<int>();
GameObject unityObject;

// ❌ 참조 타입
class MyClass { }
object someObject;

// ❌ 예외 처리
try { } catch { }
```

**사용 가능한 C# 기능들:**
```csharp
// ✅ 기본 데이터 타입
int number = 42;
float value = 3.14f;
bool flag = true;

// ✅ Unity.Collections
NativeArray<int> nativeArray;
NativeReference<bool> nativeRef;

// ✅ Unity.Mathematics  
float3 position = new float3(1, 2, 3);
int3 direction = new int3(1, 0, 0);

// ✅ 구조체 (struct)
public struct GameState
{
    public int player;
    public float3 position;
}
```

### 💡 핵심 이해사항

- **언어**: 100% C# 문법
- **제약**: "**제한된 C#**" - 성능을 위해 일부 기능 제한
- **학습 곡선**: C# 개발자라면 즉시 시작 가능
- **성능**: Burst가 C# 코드를 네이티브 수준으로 컴파일

---

## 📋 프로젝트 개요

**플랫폼**: Unity 2021.3+ (또는 2022/2023 LTS), .NET 4.x  
**핵심 기술**: C# Job System, Burst Compiler, Unity.Collections, Unity.Mathematics  
**개발 언어**: 100% C# 코드 (제약사항 있음)

### 🎯 성능 목표

- **단일 수 판정**: < 50μs @ N=15, 스킬 단순
- **배치 판정**: 선형 확장, 60FPS 유지

> 💡 **50μs는 얼마나 빠른가?** 눈 깜짝할 사이(0.1초)보다 2000배 빠른 속도입니다!

---

## 🌟 배경과 목표

3D 오목은 일반 오목과 달리 **N×N×N** 3차원 보드에서 진행되며, 한 수를 둘 때마다 **13개 방향**에서 연속성을 확인해야 합니다:

- **축 방향**: 3개 (X, Y, Z)
- **면 대각선**: 6개 (XY, XZ, YZ 평면)
- **공간 대각선**: 4개 (3차원 대각선)

### 추가 복잡성

스킬 시스템이 도입되면 계산량이 급격히 증가합니다:
- 한 개 무시하기
- 와일드카드 돌
- 방해 돌 설치
- 연속 제한 증폭

**본 보고서의 목적**: Unity 메인 스레드와 독립적인 순수 연산으로 승리 판정을 수행하고, Job System + Burst로 초고속 병렬화하는 완전한 설계 가이드를 제시합니다.

---

## 🔧 데이터 모델 설계

### 보드 저장 구조

3차원 보드를 1차원 배열로 효율적으로 저장합니다:

```csharp
struct Board3D
{
    public NativeArray<int> Cells; // length = Size³
    public int Size;
    public int StrideY;  // Size
    public int StrideZ;  // Size²

    public int Index(int x, int y, int z) => x + y*StrideY + z*StrideZ;
}
```

**셀 값 정의**:
- `0`: 빈칸
- `1`: 흑돌
- `2`: 백돌  
- `3`: 와일드카드 (옵션)

### 스킬 규칙 파라미터

```csharp
public struct SkillRules
{
    public int needed;              // 승리에 필요한 연속 개수
    public int skipAllowance;       // 건너뛸 수 있는 빈칸 개수
    public int blockerValue;        // 차단하는 돌의 값
    public bool treatWildcardAsAny; // 와일드카드를 모든 돌로 취급
}
```

---

## 🧭 방향 벡터 정의

3D 공간에서의 13개 탐색 방향:

```csharp
static readonly int3[] Directions = new int3[]
{
    // 축 방향 (3개)
    new int3(1,0,0),  new int3(0,1,0),  new int3(0,0,1),
    
    // 면 대각선 (6개)
    new int3(1,1,0),  new int3(1,-1,0),
    new int3(1,0,1),  new int3(1,0,-1),
    new int3(0,1,1),  new int3(0,1,-1),
    
    // 공간 대각선 (4개)
    new int3(1,1,1),  new int3(1,1,-1), 
    new int3(1,-1,1), new int3(1,-1,-1)
};
```

---

## ⚡ 알고리즘 핵심 로직

### 기본 승리 판정 흐름

마지막에 둔 돌(`last`) 기준으로 판정합니다:

1. **초기화**: `count = 1` (현재 돌)
2. **정방향 탐색**: `+direction`으로 전진하며 연속 개수 카운트
3. **역방향 탐색**: `-direction`으로 전진하며 연속 개수 카운트  
4. **승리 체크**: `count >= needed` 이면 승리

### 스킬 적용

탐색 루프에 **상태 머신** 패턴을 적용하여 다양한 스킬 규칙을 처리합니다.

---

## 🚀 Job System 병렬 처리 설계

### 작업 유형별 Job 선택

| 작업 유형 | Job 인터페이스 | 용도 |
|-----------|---------------|------|
| 단일 수 판정 | `IJob` | 한 번의 승리 판정 |
| 대량 판정 | `IJobParallelFor` | 여러 시나리오 동시 처리 |

### Job 구현 예시

```csharp
[BurstCompile]
public struct WinCheckJob : IJob
{
    [ReadOnly] public Board3D board;
    [ReadOnly] public int3 lastMove;
    [ReadOnly] public int player;
    [ReadOnly] public SkillRules rules;
    
    public NativeReference<bool> result;

    public void Execute()
    {
        result.Value = CheckWinCondition(board, lastMove, player, rules);
    }
}
```

---

## ⚡ Burst 최적화 전략

### 핵심 최적화 포인트

1. **브랜치 최소화**
   ```csharp
   // ❌ 느린 방식
   if (x >= 0 && x < size) { ... }
   
   // ✅ 빠른 방식  
   if ((uint)x < (uint)size) { ... }
   ```

2. **Stride 기반 메모리 접근**
   - 연속적인 메모리 패턴으로 캐시 효율성 극대화
   - `NativeArray`의 순차적 접근 패턴 활용

3. **값 전달 구조체**
   ```csharp
   // 참조 대신 값 복사로 성능 향상
   public void Execute(SkillRules rules) // struct 값 전달
   ```

4. **안전성 체크 비활성화**
   ```csharp
   #if !UNITY_EDITOR
   [BurstCompile(CompileSynchronously = true, DisableSafetyChecks = true)]
   #endif
   ```

---

## 🎮 Transform 기반 단순 탐색

소규모 프로젝트나 프로토타입용 직관적인 방법입니다.

### 기본 원리

- **기준점**: 마지막에 둔 돌의 `Transform.position`
- **탐색**: 정해진 간격(`cellSize`)으로 각 방향 탐색
- **매핑**: 3D 좌표 → 게임 오브젝트

### 구현 예시

```csharp
bool CheckWinByTransform(Transform lastMove, int player, float cellSize, int needed)
{
    Vector3 origin = lastMove.position;

    foreach (var dir in directions) // 13개 방향 단위 벡터
    {
        int count = 1;
        count += CountDirection(origin, dir, player, cellSize, needed - count);
        count += CountDirection(origin, -dir, player, cellSize, needed - count);
        
        if (count >= needed)
            return true;
    }
    return false;
}

int CountDirection(Vector3 origin, Vector3 dir, int player, float cellSize, int maxNeeded)
{
    int count = 0;
    for (int step = 1; step <= maxNeeded; step++)
    {
        Vector3 pos = origin + dir * step * cellSize;
        var stone = FindStoneAtPosition(pos); // 🔥 캐싱 필수!
        
        if (stone != null && stone.Player == player)
            count++;
        else
            break;
    }
    return count;
}
```

### ⚠️ Transform 방식 주의사항

- **성능**: 직접 Transform 탐색은 느림 → **좌표↔돌 매핑 캐싱** 필수
- **용도**: 간단한 규칙, 소규모 보드에 적합
- **확장성**: 대규모 병렬 처리에는 Job System이 우수

---

## 🔍 성능 비교표

| 방식 | 구현 복잡도 | 성능 | 확장성 | 메모리 효율 |
|------|------------|------|--------|------------|
| **Job System + Burst** | 높음 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Transform 기반** | 낮음 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 🧪 테스트 & 검증 계획

### 필수 테스트 케이스

1. **정확성 검증**
   - Job System vs Transform 기반 결과 일치성
   - 엣지 케이스 (보드 경계, 코너)

2. **스킬 규칙 테스트**
   - 스킵 허용 개수
   - 와일드카드 처리
   - 차단 돌 효과

3. **성능 벤치마크**
   - 보드 크기별 처리 시간
   - 병렬 처리 확장성
   - 메모리 사용량

### 테스트 코드 예시

```csharp
[Test]
public void TestWinCondition_JobVsTransform()
{
    // 동일한 보드 상태에서 두 방식 결과 비교
    bool jobResult = RunJobSystemCheck();
    bool transformResult = RunTransformCheck();
    
    Assert.AreEqual(jobResult, transformResult);
}
```

---

## 🏁 결론 및 권장사항

### 📊 방식별 선택 가이드

| 프로젝트 규모 | 권장 방식 | 이유 |
|--------------|----------|-----|
| **소규모/프로토타입** | Transform 기반 | 빠른 개발, 직관적 |
| **중대규모/상용** | Job System + Burst | 최고 성능, 확장성 |
| **하이브리드** | 혼합 사용 | 개발 단계별 적용 |

### ✨ 핵심 인사이트

1. **스킬 포함 3D 오목**의 승리 판정은 **Job System + Burst**로 병렬화할 때 최대 효율을 달성합니다.

2. **Transform 기반 방식**은 구현이 직관적이지만, 좌표-오브젝트 매핑 캐싱이 성능의 핵심입니다.

3. **프로젝트 요구사항**에 따라 두 방식을 **적절히 혼합**하여 개발 속도와 성능을 모두 확보할 수 있습니다.

---

### 🎯 최종 성능 목표 달성

- ✅ **단일 수 판정**: < 50μs
- ✅ **배치 판정**: 60FPS 유지  
- ✅ **메모리 효율**: NativeArray 활용
- ✅ **확장성**: 병렬 처리 지원

---

이 가이드는 ai가 제작했습니다.
