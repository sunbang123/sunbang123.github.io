---
layout: post
title: "C# `enum`과 `[System.Flags]` 완전 가이드 — Unity/서버 실무 관점"
date: 2025-09-11 19:30:16 +0900
categories: 
tags: ["Unity", "C#"]
---

# C# `enum`과 `[System.Flags]` 완전 가이드 — Unity/서버 실무 관점

> TL;DR
>
> * **`enum`**: 값 중 **하나만** 고르는 “카테고리/상태”에 최적.
> * **`[System.Flags]`**: **여러 옵션을 동시에** 켜고 끄는 “비트마스크”에 최적.
> * **Unity**에선 상태/타입은 `enum`, 옵션·저항·권한 등은 Flags.
> * 서버/DB에선 Flags가 가볍지만, **쿼리/확장성**은 관계 테이블이 더 나을 때가 많음.

---

## 왜 지금 이걸 알아야 할까

Unity나 일반 C# 프로젝트에서 **상태/타입**과 **옵션의 조합**을 섞어 쓰다 보면 코드가 급격히 지저분해집니다. `enum`과 `[Flags]`의 **역할 분담**을 이해하면, 코드 안전성과 확장성을 모두 챙길 수 있어요.

---

## `enum` 기본: “서로 배타적인 하나”

* **특징**

  * 정수 기반 상수 집합(기본형 `int`)—**서로 배타적(one-of)** 선택
  * 컴파일 타임 체크로 **매직 넘버/문자열 제거**
  * `switch`에서 누락 시 컴파일러 경고/분기 누락 감지 용이
  * Unity 인스펙터에서 **드롭다운**(버전에 따라 기본 드롭다운 렌더)

* **언제 쓰나**

  * 플레이어 상태: `Idle`, `Run`, `Jump`, `Dead`
  * 무기 타입, 난이도, 아이템 등급 등 “카테고리”

```csharp
public enum PlayerState
{
    Idle,
    Run,
    Jump,
    Dead
}

public class Player : MonoBehaviour
{
    [SerializeField] private PlayerState state;

    private void Update()
    {
        switch (state)
        {
            case PlayerState.Idle: /* ... */ break;
            case PlayerState.Run:  /* ... */ break;
            case PlayerState.Jump: /* ... */ break;
            case PlayerState.Dead: /* ... */ break;
        }
    }
}
```

* **실무 팁**

  * 값이 **자주 변경/증가**할 항목은 ScriptableObject/데이터 테이블로 분리(데이터 주도 설계).
  * **직렬화/저장 포맷**에 값(정수)이 그대로 남으므로 \*\*값 재배치(재번호)\*\*는 주의.

---

## `[System.Flags]`: “여러 개를 동시에” (비트마스크)

* **핵심 아이디어**
  각 값에 2의 거듭제곱을 부여해 **비트를 동시에 켜/꺼서 조합**을 표현.

* **특징**

  * **복수 선택(many-of)** 가능
  * `ToString()`이 `3` 대신 `"Fire, Ice"`처럼 **조합 이름**을 출력
  * 저장/전송 시 **정수 한 칸**으로 가볍게 직렬화
  * 포함 체크가 **O(1) 비트 연산**으로 빠름

```csharp
[System.Flags]
public enum DamageType
{
    None   = 0,
    Fire   = 1 << 0, // 1
    Ice    = 1 << 1, // 2
    Poison = 1 << 2, // 4
    Shock  = 1 << 3, // 8
    // 편의 합성 값
    Elemental = Fire | Ice | Shock
}

// 사용 예
DamageType resist = DamageType.Fire | DamageType.Ice;
bool fireImmune = (resist & DamageType.Fire) != 0; // 포함 체크
resist |= DamageType.Poison;                       // 추가
resist &= ~DamageType.Ice;                         // 제거
resist ^= DamageType.Shock;                        // 토글
```

* **언제 쓰나**

  * **버프/디버프, 저항 태그**: 독립 옵션의 조합
  * **권한/역할 플래그**: Read/Write/Delete/Admin
  * **네트워크/프로토콜 옵션**: 압축/암호화/재시도 등 전송 플래그
  * **Unity**: 레이어·충돌 마스크와 유사한 패턴(※ `LayerMask` 자체는 `int` 기반 마스크)

* **성능 팁**

  * `Enum.HasFlag`는 **박싱**이 발생할 수 있어 미세하게 느릴 수 있음 → `(mask & Flag) != 0` 권장.

---

## `enum` vs `[Flags]` 선택 기준

| 기준          | enum             | \[Flags]              |
| ----------- | ---------------- | --------------------- |
| 선택 개수       | **하나**만          | **여러 개** 동시에          |
| 대표 사례       | 상태/타입/모드         | 옵션/태그/권한              |
| 인스펙터(Unity) | 드롭다운             | 마스크 필드(버전/드로워에 따라 다름) |
| 직렬화 크기      | 정수 1개            | 정수 1개                 |
| 확장성         | 값 추가는 쉬움(배타성 유지) | 비트 수(32/64) 제한, 설계 필요 |

> 의문이 들면 스스로 물어보세요:
> “**서로 독립인 작은 옵션 집합**을 **동시에 켜야** 하는가?” → 그렇다면 **Flags**.

---

## 네이밍 & 선언 규칙(실무 표준)

* **Flags는 복수형/`*Flags` 접미사** 선호: `PermissionFlags`, `EffectFlags`
* 항상 `None = 0`
* 각 플래그는 **2의 거듭제곱**: `1, 2, 4, 8, ...`
* **합성 값**은 문서화(예: `Elemental = Fire | Ice | Shock`)
* 32개 이내면 `int`(Unity 호환성·간단함), 64개 필요 시 `long` 고려
  *(Unity 인스펙터/툴링과의 호환을 프로젝트 규칙으로 맞추세요.)*
* 저장/네트워크는 **정수로 직렬화**(예: JSON에서는 숫자)

---

## Unity에서의 활용 포인트

* **상태/타입**: 일반 `enum` → 인스펙터 드롭다운으로 직관적
* **옵션 조합**: `[Flags]` → 마스크 형태 UI(프로젝트/버전에 따라 기본 또는 커스텀 드로워 사용)
* **직렬화 주의**: 에셋/세이브데이터에 **정수값이 고정**되므로

  * 중간에 \*\*값 재배열(순서·숫자 변경)\*\*은 깨질 수 있음
  * **신규 플래그는 새로운 비트**에만 추가
* **에디터 코드**: 필요하면 `EditorGUILayout.EnumFlagsField`/커스텀 프로퍼티 드로워로 UX 개선

---

## 서버/DB/분석 관점

* **장점**: Flags는 저장·전송·메모리에 **작고 빠름**
* **단점**: 복잡한 분석/검색(“이 태그 중 2개 이상 포함” 등)이 **어렵고 가독성↓**
* **SQL 예시** (포함 여부):

  ```sql
  -- item_flags 컬럼에 Poison(4) 포함 여부
  SELECT *
  FROM items
  WHERE (item_flags & 4) <> 0;
  ```
* **대안**: 확장성·쿼리성이 중요한 경우 **관계 테이블**(N\:N, 태그 테이블+조인) 사용
  → 비용은 들지만 **인덱싱/집계/통계**에 유리

**실무 권장**

* 실시간 경로/핫패스: **Flags**로 가볍게
* 리포팅/BI/복잡 질의: **정규화된 테이블**로 별도 적재

---

## 자주 하는 실수 & 체크리스트

* ❌ 연속 번호 사용(`A=0, B=1, C=2`)로 Flags 선언

  * ✅ **2의 거듭제곱**만 사용
* ❌ `None != 0`

  * ✅ `None = 0` (초기화/리셋/기본값)
* ❌ 값 재배열/삭제로 **직렬화 깨짐**

  * ✅ 기존 비트는 유지, **새 비트만 추가**
* ❌ 무한히 늘어나는 플래그 세트

  * ✅ 32/64비트 한계 고려, 커지면 **데이터 모델 재설계**
* ❌ `HasFlag` 남용

  * ✅ `(mask & Flag) != 0` 사용

---

## 패턴별 레시피

### 1) 상태 머신(배타적) — `enum`

```csharp
public enum EnemyState { Idle, Patrol, Chase, Attack, Dead }
```

### 2) 권한 시스템(조합) — `[Flags]`

```csharp
[Flags]
public enum PermissionFlags
{
    None   = 0,
    Read   = 1 << 0,
    Write  = 1 << 1,
    Delete = 1 << 2,
    Admin  = Read | Write | Delete
}
```

### 3) 네트워크 옵션(전송 플래그)

```csharp
[Flags]
public enum PacketFlags
{
    None      = 0,
    Compressed= 1 << 0,
    Encrypted = 1 << 1,
    Retries   = 1 << 2
}
```

---

## 버전업/호환 전략

* **앞쪽 비트부터 순차 할당**(문서화 필수)
* “예약 비트” 범위를 잡아두면 향후 확장 용이
* 저장 포맷에는 **정수값**만 남기고, **이름 변경은 자유롭게**(단, 숫자 불변)
* 대규모 변경 시 **마이그레이션 스크립트**로 안전하게 변환

---

## 결론

* \*\*`enum`은 “하나만 고르는 상태/카테고리”\*\*에,
* \*\*`[Flags]`는 “동시에 켜는 독립 옵션”\*\*에 쓰세요.
* Unity 클라이언트라면 둘을 섞어 **상태는 enum, 옵션은 Flags**로 분리하는 구성이 가장 깔끔합니다.
* 서버/DB에선 \*\*성능·단순성(Flags)\*\*과 **쿼리성·확장성(정규화)** 사이에서 **유스케이스별로 혼용**하세요.

---

## 부록: 빠른 결정표

* “값 중 **하나만** 선택해야 한다?” → **enum**
* “옵션을 **여러 개** 조합해야 한다?” → **\[Flags]**
* “옵션이 **32\~64개 이하**로 고정/작다?” → **\[Flags]**
* “옵션이 **계속 늘어나고** 복잡 쿼리가 필요?” → **정규화/데이터 테이블**

