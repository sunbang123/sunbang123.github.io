---
layout: post
title: "튜토리얼 & 훈련장 씬 구조 설계"
date: 2025-10-01 18:42:00 +0900
categories: 
tags: ["Software-Development", "Game Development"]
---

# 초스피드 게임 개발, 난장판 코드 정리 완전 가이드

게임 잼이나 빠른 프로토타이핑을 하다 보면 어느새 코드가 1000줄을 넘어가고, 숫자들이 코드 곳곳에 박혀있습니다. "나중에 정리하지 뭐" 하다가 결국 전체를 다시 짜게 되는 경험, 한 번쯤은 있으시죠? 이 글에서는 빠르게 개발하면서도 최소한의 질서를 유지하는 실전 노하우를 정리했습니다.

## 왜 매직넘버를 상수화해야 할까?

### 1. 한 곳만 바꾸면 모든 곳이 바뀝니다

플레이테스터가 "점프가 너무 낮아요"라고 했을 때, 점프력 `5.5f`가 코드 10군데에 박혀있다면? 모두 찾아서 바꿔야 합니다. 하나라도 놓치면 버그입니다.

상수로 만들면:

```csharp
const float JUMP_FORCE = 5.5f;
```

이 한 줄만 `7.0f`로 바꾸면 끝입니다. 밸런싱이 10배 빨라집니다.

### 2. 코드가 스스로 설명합니다

```csharp
// ❌ 이게 뭔 조건이지?
if(distance < 10 && timer > 3.5f && health < 20)

// ✅ 아하! 보스 등장 조건이구나
if(distance < BOSS_TRIGGER_DISTANCE && 
   timer > MIN_BATTLE_TIME && 
   health < LOW_HEALTH_THRESHOLD)
```

3개월 후 자신도 이해할 수 있는 코드를 쓰세요.

### 3. 게임 밸런스를 한눈에 조절합니다

```csharp
public static class GameConfig {
    public const float PLAYER_SPEED = 5f;
    public const int MAX_HEALTH = 100;
    public const float ENEMY_SPAWN_RATE = 2f;
    public const int EASY_ENEMY_DAMAGE = 10;
    public const int HARD_ENEMY_DAMAGE = 25;
}
```

모든 수치가 한 곳에 있으면 전체 밸런스를 파악하고 조절하기 쉽습니다.

### 4. 실수를 컴파일러가 잡아줍니다

```csharp
const float PLAYER_SPEED = 5.5f;
PLAYER_SPEED = 5.6f;  // 컴파일 에러!
```

타이핑 실수로 값이 바뀌는 것을 원천 차단합니다.

## 초스피드 개발 시 꼭 지킬 5가지

### 1. 폴더 구조에 5분 투자하세요

```
/Scripts
  /Core        # GameManager, SceneManager
  /Player      # 플레이어 관련
  /Enemy       # 적 관련
  /UI          # UI 관련
  /Utils       # 유틸리티
```

나중에 찾기 쉽습니다. 이것만 해도 개발 속도가 20% 빨라집니다.

### 2. 한 스크립트 = 한 책임

- PlayerController → 이동과 점프만
- PlayerHealth → 체력 관리만
- PlayerInventory → 아이템만

200줄 넘어가면 분리를 고려하세요. 500줄 넘어가면 반드시 분리하세요.

### 3. 변수명은 3초 안에 이해되게

```csharp
// ❌ 3일 후 기억 안남
int t, x, cnt;

// ✅ 3초만에 이해됨
int targetEnemyCount;
float jumpForce;
bool isGrounded;
```

### 4. Update()는 가볍게 유지하세요

```csharp
// ❌ 매 프레임마다 찾기
void Update() {
    GameObject.Find("UI").GetComponent<Text>().text = score.ToString();
}

// ✅ 시작할 때 한 번만
private Text scoreText;
void Start() {
    scoreText = GameObject.Find("UI").GetComponent<Text>();
}
void Update() {
    scoreText.text = score.ToString();
}
```

### 5. 디버그 코드는 태그를 달아두세요

```csharp
// DEBUG: 나중에 제거
if(Input.GetKeyDown(KeyCode.K)) {
    player.health = 9999;
}
```

나중에 Ctrl+F로 "DEBUG" 검색하면 한번에 찾습니다.

## 1000줄 코드, 단계별 정리법

### Phase 1: 현황 파악 (30분)

스크립트가 하는 일을 적어보세요:
- 플레이어 이동 ✓
- 체력 관리 ✓
- 인벤토리 ✓
- UI 업데이트 ✓
- 사운드 재생 ✓

**5개 이상이면 분리가 필요합니다.**

Ctrl+F로 중복 코드를 찾으세요. 같은 코드가 3번 이상 나오면 함수로 추출하세요.

### Phase 2: 매직넘버 → 상수 (1시간)

가장 빠르게 효과를 보는 작업입니다.

**작업 순서:**
1. 스크립트 상단에 상수 섹션 만들기
2. 의미있는 숫자들 찾기 (게임 로직 관련)
3. 상수로 선언하고 이름 붙이기

**팁:** `0`, `1`, `-1` 같은 기본 수치는 그대로 두세요. 게임 특정 값들만 상수화하세요.

### Phase 3: 스크립트 분리 (2시간)

1000줄짜리를 여러 개로 쪼개세요.

**분리 기준:**
- 책임별로 (이동/전투/인벤토리)
- 200줄 이상이면 고려
- 500줄 이상이면 필수
- Update() 안에 if문 10개 이상이면 신호

**예시:**
```
PlayerController (1000줄)
  ↓
PlayerMovement (250줄)
PlayerCombat (300줄)
PlayerHealth (200줄)
PlayerUI (250줄)
```

### Phase 4: 중복 코드 함수화 (1시간)

같은 코드가 여러 곳에 있다면 하나의 함수로 만드세요.

**장점:**
- 버그 수정이 쉬워짐 (한 곳만)
- 기능 추가가 편해짐
- 코드가 짧아짐

## 시간별 작업 전략

### 첫 30분: 기본 구조
- 폴더 생성, 씬 정리
- GameManager 뼈대 만들기
- Config 파일 준비

### 1-4시간: 빠른 구현
- Copy-Paste 해도 됨
- 하드코딩 해도 됨
- 단, `// FIXME` 태그는 달기

### 마지막 1시간: 정리 타임
- 중복 코드 함수로 추출
- 매직넘버 상수화
- 안 쓰는 코드 삭제

## 긴급! 1시간만 있을 때

**20분: 상수화**
가장 자주 바뀌는 값들만 상수로 만드세요.

**20분: 함수명 개선**
`A()`, `DoStuff()` → `CheckGameOver()`, `SpawnEnemy()`

**20분: 핵심 주석**
각 주요 함수에 한 줄씩:

```csharp
/// <summary>플레이어 사망 처리</summary>
void HandlePlayerDeath() { ... }
```

## 게임잼 생존 체크리스트

**즉시 효과 (2시간)**
- [ ] public → `[SerializeField] private`
- [ ] 매직넘버 → 상수
- [ ] 의미있는 변수명
- [ ] 미사용 코드 삭제
- [ ] DEBUG 태그 달기

**구조 개선 (4시간)**
- [ ] 200줄+ 스크립트 분리
- [ ] 중복 코드 함수화
- [ ] Update() 최적화
- [ ] GetComponent 캐싱
- [ ] 폴더 정리

**최적화 (선택)**
- [ ] 오브젝트 풀링
- [ ] 이벤트 시스템
- [ ] ScriptableObject 활용

## 절대 하지 말아야 할 것

1. ❌ `GameObject.Find()` 매 프레임 호출
2. ❌ `GetComponent()` 반복 호출
3. ❌ 모든 로직을 한 스크립트에
4. ❌ 버전 관리 없이 덮어쓰기
5. ❌ 변수명 a, b, c, temp1, temp2

## 시간 절약 팁 모음

### UnityEvent 활용
```csharp
public UnityEvent OnPlayerDeath;
public UnityEvent<int> OnScoreChanged;
// 복잡한 참조 대신 이벤트로
```

### ScriptableObject 활용
적, 아이템, 무기 스탯을 SO로 만들면 코드 수정 없이 밸런싱 가능합니다.

### 에디터 확장
```csharp
[ContextMenu("Reset Player")]
void ResetPlayer() {
    // 우클릭으로 바로 실행
}
```

## 실전 Before & After

**정리 전:**

```csharp
public class Player : MonoBehaviour {
    public float s = 5;
    public int h = 100;
    float t = 0;
    
    void Update() {
        if(Input.GetKey(KeyCode.W)) {
            transform.position += Vector3.forward * s * Time.deltaTime;
        }
        t += Time.deltaTime;
        if(t > 2) {
            h -= 10;
            t = 0;
        }
        GameObject.Find("UI").GetComponent<Text>().text = h.ToString();
    }
}
```

**문제점:**
- 변수명 의미 불명 (s, h, t?)
- 모든 로직이 Update()에
- GameObject.Find() 매 프레임
- 이동/체력/UI가 한 곳에

**정리 후:**

```csharp
// PlayerMovement.cs
public class PlayerMovement : MonoBehaviour {
    [SerializeField] private float moveSpeed = 5f;
    
    void Update() {
        HandleMovement();
    }
    
    void HandleMovement() {
        if(Input.GetKey(KeyCode.W)) {
            MoveForward();
        }
    }
    
    void MoveForward() {
        transform.position += Vector3.forward * moveSpeed * Time.deltaTime;
    }
}

// PlayerHealth.cs
public class PlayerHealth : MonoBehaviour {
    private const int MAX_HEALTH = 100;
    private const float DAMAGE_INTERVAL = 2f;
    private const int PERIODIC_DAMAGE = 10;
    
    private int currentHealth;
    private float damageTimer;
    private PlayerUI ui;
    
    void Start() {
        currentHealth = MAX_HEALTH;
        ui = FindObjectOfType<PlayerUI>();
    }
    
    void Update() {
        ApplyPeriodicDamage();
    }
    
    void ApplyPeriodicDamage() {
        damageTimer += Time.deltaTime;
        if(damageTimer >= DAMAGE_INTERVAL) {
            TakeDamage(PERIODIC_DAMAGE);
            damageTimer = 0;
        }
    }
    
    public void TakeDamage(int damage) {
        currentHealth -= damage;
        ui.UpdateHealth(currentHealth);
    }
}
```

**개선 사항:**
- 책임 명확히 분리
- 의미있는 변수명
- 상수화 완료
- UI 참조 캐싱
- 각 함수가 한 가지만

## 핵심 정리

**"완벽한 코드가 아니라 나중에 고칠 수 있는 코드"**

- 매직넘버 상수화 30분 → 나중에 3일 절약
- 스크립트 분리 2시간 → 나중에 1주일 절약
- 변수명 개선 20분 → 디버깅 시간 반으로

완벽한 코드는 없습니다. 하지만 조금씩 개선해나가는 코드는 있습니다. 오늘부터 작은 것 하나씩 시작해보세요.

---

*이 글이 도움이 되셨다면, 여러분의 코드 정리 경험도 댓글로 공유해주세요!*
