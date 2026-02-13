---
layout: post
title: "유니티(Unity) 게임 유틸리티: AI 시스템"
date: 2026-02-13 19:44:00 +0900
categories: 
tags: ["Unity", "AI"]
---

## 1. 개요 (Overview)

게임 개발 생산성을 높이기 위한 공용 유틸리티 클래스(Util Class)의 구현 내용과, 몬스터 및 NPC의 지능적인 이동을 구현하기 위한 **Unity AI 내비게이션 시스템(`UnityEngine.AI`)**의 기술적 특징을 분석했습니다.

### 2.1. 디버깅 최적화 (Conditional Logging)

* **기능:** 개발 단계에서만 로그를 출력하고, 실제 빌드(Release) 시에는 로그가 포함되지 않도록 처리.
* **기술적 특징:** `#if UNITY_EDITOR` 전처리기를 사용하여 빌드 시 불필요한 문자열 연산과 메모리 할당을 방지함.
* **메서드:** `Log`, `LogRed`, `LogGreen`, `LogBlue` (색상별 로그 지원).

### 2.2. 거리 및 도착 판정 (Distance Check)

* **기능:** 대상(Target)이 특정 목적지에 도착했는지 판단.
* **기술적 특징:** `Vector3.Distance`를 사용하여 유클리드 거리를 계산하고, 허용 오차(Offset) 내에 진입했는지 검사함.

### 2.3. 시야각(FOV) 판정 (Field of View)

* **기능:** 적(Enemy)이 플레이어를 감지할 수 있는지 시야각과 거리를 동시에 판정.
* **구현 로직:**
1. **거리 검사:** `Vector3.Distance`로 사정거리 내에 있는지 1차 확인.
2. **각도 검사:** `Vector3.Angle`을 사용하여 적의 전방 벡터(`forward`)와 플레이어 방향 벡터 사이의 각도를 계산.
3. **결과:** 두 조건이 모두 충족될 경우 `true` 반환.

---

## 3. Unity AI 내비게이션 시스템 분석

코드 상단에 선언된 `using UnityEngine.AI;`는 유니티의 내장 길 찾기 시스템을 활용하기 위함이다.

### 3.1. 핵심 구성 요소

1. **NavMesh (Navigation Mesh):**

* 게임 월드 내에서 캐릭터가 이동 가능한 영역(Walkable Area)을 미리 계산하여 구운(Bake) 데이터.
* 장애물과 이동 불가능한 지역을 제외한 경로 데이터를 포함함.


2. **NavMeshAgent:**

* AI 캐릭터에 부착되는 컴포넌트로, `SetDestination()` 메서드를 통해 목적지까지 최단 경로를 계산하고 장애물을 회피하며 이동함.


3. **NavMeshObstacle:**

* 동적으로 움직이는 장애물(예: 문, 움직이는 상자)에 부착하여 NavMesh를 실시간으로 갱신하게 함.



---

## 4. 구현 코드 (Source Code)

```csharp
using UnityEngine;
using UnityEngine.AI; // AI 네임스페이스 선언

/// <summary>
/// 게임 전반에 사용되는 공용 유틸리티 클래스
/// </summary>
public class Util
{
    #region [Logging System]
    // 에디터 환경에서만 동작하는 디버그 로그 래퍼
    public static void Log(object message)
    {
#if UNITY_EDITOR
        Debug.Log($"{message}");
#endif
    }

    public static void LogRed(object message)
    {
#if UNITY_EDITOR
        Debug.Log($"<color=red>{message}</color>");
#endif
    }
    #endregion

    #region [Math & Physics Helper]
    /// <summary>
    /// 목적지 도착 여부 확인
    /// </summary>
    public static bool IsArrived(Transform selfTransform, Vector3 destination, float offset = 0.1f)
    {
        return Vector3.Distance(selfTransform.position, destination) < offset;
    }

    /// <summary>
    /// 시야각(FOV) 내 타겟 존재 여부 확인
    /// </summary>
    public static bool IsInSight(Transform selfTransform, Transform target, float sightAngle, float sightRange)
    {
        // 1. 방향 벡터 계산
        Vector3 direction = (target.position - selfTransform.position).normalized;

        // 2. 시야각 검사 (Angle)
        if (Vector3.Angle(selfTransform.forward, direction) <= sightAngle)
        {
            // 3. 거리 검사 (Distance)
            if (Vector3.Distance(selfTransform.position, target.position) <= sightRange)
            {
                return true; // 감지 성공
            }
        }
        return false; // 감지 실패
    }
    #endregion
}

```

---

## 5. 결론

* **유지보수성 향상:** 반복되는 수학적 계산 로직을 `Util` 클래스로 모듈화하여 코드 중복을 제거함.
* **성능 최적화:** 조건부 컴파일(`Conditional Compilation`)을 적용하여 릴리즈 빌드의 성능 저하를 방지함.
* **확장성:** `UnityEngine.AI` 네임스페이스를 도입함으로써, 향후 `NavMeshAgent`를 활용한 정교한 몬스터 추적 및 회피 알고리즘 구현의 기반을 마련함.

---

### 💡 첨언 (작성자 메모)

> 현재 `Util` 클래스 내부에서는 `UnityEngine.AI` 기능을 직접 사용하지 않으나, 향후 `NavMeshPath` 경로 계산이나 `CalculatePath` 등의 유틸리티 함수 확장을 고려하여 네임스페이스를 유지함.
