---
layout: post
title: "튜토리얼 & 훈련장 씬 구조 설계"
date: 2025-09-27 16:00:00 +0900
categories: 
tags: ["Software-Development", "Game Theory"]
---

# 튜토리얼 & 훈련장 씬 구조 설계

## 1. 개념

### 튜토리얼 씬

* 게임 시작 시 기본 조작과 게임 흐름을 학습시키는 별도 씬
* 장점:

  * 로직 단순화
  * 튜토리얼 전용 UI/오브젝트 구성 가능
* 단점:

  * 씬 전환 필요
  * 상태 전달 구현 필요

### 훈련장 씬

* 실제 인게임 씬을 그대로 사용하여 자유 연습 가능
* 장점:

  * 코드/씬 재사용 가능
  * 실제 게임 환경과 동일한 연습 가능
* 단점:

  * 튜토리얼 전용 기능과 혼동될 수 있음 → 상태 플래그 필요

## 2. 구조 설계

### 하이브리드 구조

```
게임 시작 → 튜토리얼 씬 (별도 씬)
튜토리얼 종료 후 → 인게임 씬 재사용 → 훈련장 모드
```

* 튜토리얼: 별도 씬
* 훈련장: 인게임 씬 재사용
* 모드 구분: 상태 플래그 또는 모드 변수

### 상태 관리 예시 (Unity C#)

```csharp
public enum GameMode { Tutorial, Training, InGame }

public class GameModeManager : MonoBehaviour
{
    public GameMode currentMode;

    void StartTutorial() {
        currentMode = GameMode.Tutorial;
        // 튜토리얼 전용 로직 실행
    }

    void StartTraining() {
        currentMode = GameMode.Training;
        // 인게임 씬 재사용, 훈련장 로직 실행
    }

    void StartGame() {
        currentMode = GameMode.InGame;
        // 실제 게임 로직 실행
    }
}
```

## 3. 다른 게임 사례

| 게임      | 방식        | 특징                           |
| ------- | --------- | ---------------------------- |
| 오버워치    | 튜토리얼 씬 분리 | 튜토리얼 전용 씬, 실제 매치와 분리됨        |
| 스타듀 밸리  | 씬 통합      | 게임 씬 내에서 튜토리얼 진행, 상태 플래그로 구분 |
| 마인크래프트  | 씬 통합      | 월드 생성 후 튜토리얼 진행, 실제 환경 재사용   |
| 서브웨이 서퍼 | 튜토리얼 별도   | 튜토리얼 씬 분리, 인게임 씬 재사용 없음      |

## 4. 요약

* 튜토리얼은 별도 씬으로 분리해 기초 교육에 집중
* 훈련장은 실제 인게임 씬을 재사용해 자유 연습 제공
* 모드 구분과 로직 충돌 방지를 위해 **상태 플래그** 또는 **모드 변수** 사용
