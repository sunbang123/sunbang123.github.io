---
layout: project
title: "Action Hunters"
date: 2026-07-22
description: "헌터 부대를 성장시키고 제한 시간 동안 상대보다 높은 점수를 겨루는 Unity 기반 1:1 액션 디펜스 게임"
thumbnail: "/assets/images/thumbnail/action-hunters.png"
icon: "fas fa-gamepad"
tags: ["Unity", "C#", "Photon Fusion", "WebGL", "itch.io", "Input System", "AI Navigation"]
demo_url: "https://sunyeong.itch.io/action-hunters"
github_url: ""
status: "in-progress"
hobby_game: true
game_type: "1:1 액션 디펜스"
---

# Action Hunters

### Project Title: 헌터 부대를 운용해 점수를 겨루는 1:1 액션 디펜스 게임

> 몬스터를 사냥해 골드를 모으고, 최대 4명의 헌터를 고용·교체하며, 한 명을 직접 조작하고 나머지는 AI에 맡겨 상대 진영과 점수 경쟁을 벌이는 게임입니다.

> <h4><a href="https://sunyeong.itch.io/action-hunters">itch.io 공개 플레이 바로가기</a></h4>

* * *

### 프로젝트의 탄생

Action Hunters는 Unity와 Photon Fusion을 활용한 1:1 디펜스 게임이라는 아이디어에서 시작했습니다. 단순히 상대를 직접 공격하는 데 그치지 않고, 몬스터 사냥으로 자원을 확보한 뒤 어떤 헌터를 고용하고 누구를 직접 조작할지 선택하는 **전투와 부대 운영의 결합**을 핵심 재미로 삼았습니다.

초기 기획을 실제로 검증할 수 있도록 5분 경기, 4인 헌터 부대, 역할별 전투, 고용 경제, 대칭형 전장, 점수 규칙을 MVP 범위로 구체화했습니다. 2026년 7월 22일에는 점프와 맵 기믹까지 포함한 오프라인 버티컬 슬라이스를 WebGL로 배포해 브라우저에서 플레이 가능한 상태를 만들었습니다.

## Project Overview

**목적:**

두 플레이어가 제한 시간 동안 몬스터 사냥, 골드 획득, 헌터 고용과 교체, 상대 헌터 처치를 반복하며 자신만의 부대 구성과 동선을 선택하게 합니다. 최종적으로는 Photon Fusion Host Mode를 사용해 두 클라이언트가 동일한 경기 상태를 공유하는 1:1 온라인 MVP를 완성하는 것이 목표입니다.

**핵심 게임 루프:**

1. 기본 헌터 한 명으로 경기를 시작합니다.
2. 맵의 몬스터와 중앙 목표를 공략해 골드를 획득합니다.
3. 골드를 사용해 역할과 등급이 다른 헌터를 최대 4명까지 고용·교체합니다.
4. 한 명의 헌터를 직접 조작하고 나머지 헌터는 AI가 추적·전투·지원 행동을 수행합니다.
5. 상대 헌터와 깃발 등 주요 목표를 공략해 점수를 얻고, 경기 종료 시 더 높은 점수를 기록한 플레이어가 승리합니다.

## 핵심 구현 기능

### 헌터 전투와 부대 운용

- **4개 역할:** 전열을 지키는 Guardian, 원거리 공격의 Ranger, 회복을 담당하는 Medic, 기동력과 근접 화력을 가진 Striker로 역할을 구분했습니다.
- **직접 조작 전환:** 숫자키 1~4, Tab, D-pad로 직접 조작할 헌터를 바꿀 수 있으며 카메라와 HUD가 선택한 헌터를 추적합니다.
- **자율 전투 AI:** 직접 조작하지 않는 헌터는 유효한 적을 탐색하고 이동·공격·스킬·부활 행동을 수행합니다.
- **고용 경제:** 몬스터 처치로 골드를 얻고, 고용 입력을 통해 새로운 헌터를 부대에 합류시킵니다.
- **생명주기 처리:** 피격, 사망, 부활, 헌터 전환 시 입력과 상태가 정상적으로 복구되도록 구성했습니다.

### 점프와 맵 기믹

- **플레이어 점프:** 3.2m 높이의 점프에 코요테 타임과 입력 버퍼를 적용하고, 공중 이동·천장 충돌·단상 및 파이프 착지를 처리했습니다.
- **AI 점프:** AI도 높은 표적이나 장애물을 만났을 때 점프를 시도합니다.
- **Jump Pad:** 일반 점프보다 높은 4.8m로 캐릭터를 발사해 빠른 진입과 이탈 경로를 제공합니다.
- **Pipe:** 상단에 진입하면 짧은 대기 후 중앙 전장 방향으로 캐릭터를 발사합니다.
- **Flag:** 아군 깃발은 회복·방어 집결점으로, 적 깃발은 점령 시 점수를 얻는 목표로 작동합니다.
- **원소 스테이션:** Water는 회복과 피해 감소, Fire는 단일 대상 투사체, Wind는 이동 경로 발사, Earth는 범위 피해와 공중 띄우기를 제공합니다.

### 온보딩과 조작 안내

첫 플레이에서도 규칙을 이해할 수 있도록 시작 규칙 카드와 6단계 튜토리얼을 구현했습니다. 승리 조건, 몬스터와 골드, 고용, 보스, 깃발, 원소 스테이션, Jump Pad와 Pipe를 경기 안에서 순서대로 안내합니다. 튜토리얼은 실제 이동과 점프 입력을 확인한 뒤 다음 단계로 진행합니다.

## Controls

| 행동 | 키보드·마우스 | 게임패드 |
| --- | --- | --- |
| 이동 | WASD | Left Stick |
| 점프 | Space | A |
| 기본 공격 | LMB | RT |
| 역할 스킬 | C | RB |
| 고용 | E | Y |
| 헌터 전환 | 1~4 / Tab | D-pad |
| 규칙 다시 보기 | F1 / H | Select |

점프를 Space와 Gamepad A에 전용 배치하고, 역할 스킬과 고용 입력을 분리해 기존 입력 충돌을 제거했습니다.

## System Architecture

현재 공개 빌드는 코어 게임 루프와 조작감을 먼저 검증하기 위한 **오프라인 버티컬 슬라이스**입니다. 경기 상태, 헌터 부대, 전투 판정, 스폰과 부활, 골드, 점수를 각각 독립적인 런타임 책임으로 분리하고, 조정값은 데이터 자산에서 관리하는 구조를 지향합니다.

온라인 단계에서는 Photon Fusion Host Mode를 우선 사용합니다. 클라이언트는 이동·공격·고용과 같은 의도를 제출하고, 호스트가 스폰, AI 판단, 피해, 사망, 보상, 골드, 점수, 경기 시간과 결과를 최종 확정합니다. 카메라, HUD, VFX는 각 클라이언트의 로컬 표현으로 유지해 네트워크 상태와 분리할 계획입니다.

## Tech Stack

- **Engine:** Unity 6000.3.8f1, Universal Render Pipeline
- **Programming:** C#
- **Networking:** Photon Fusion 2.0.12 Stable, Host Mode 기반 1:1 구조
- **Gameplay:** Input System, AI Navigation, Animator Controller, ScriptableObject
- **Platform:** Unity WebGL, Windows PC 목표
- **Distribution:** itch.io
- **Documentation:** Notion

## Validation

- 최종 C# 솔루션 빌드에서 경고 0개, 오류 0개를 확인했습니다.
- 기능 구현 과정에서 EditMode 테스트 12개와 PlayMode 테스트 2개가 통과했습니다.
- 일반 점프, 공중 재점프 차단, 단상·파이프 착지, 원소 스테이션, Jump Pad, Pipe, Flag 점수와 쿨다운을 자동 또는 수동으로 검증했습니다.
- Unity Game 뷰에서 초보자 규칙 카드, 6단계 튜토리얼, 헌터 고용·전환, 적 헌터 처치, 적 Flag 점령을 확인했습니다.
- itch.io 공개 환경에서 Unity WebGL 자산 로드, WebGL 2.0과 Input System 초기화, 오프라인 경기 시작, 실제 화면 렌더링을 확인했습니다.

마지막 HUD·VFX·튜토리얼 보강분은 사용 중인 Unity Editor 세션을 보호하기 위해 전체 Test Runner를 다시 실행하지 않았으며, 최종 컴파일과 읽기 전용 코드 검토로 보완했습니다.

## Trouble Shooting

### itch.io WebGL 배포 후 회색 화면과 404

최초 업로드에서는 `index.html`만 정상 응답하고 `Build/*`와 `TemplateData/*` 파일이 모두 404를 반환해 Unity 화면이 회색으로 멈췄습니다. Windows PowerShell의 `Compress-Archive`가 ZIP 내부 폴더명을 역슬래시 경로로 기록했고, Linux 기반 itch.io 압축 해제 환경에서 폴더 구조가 올바르게 복원되지 않은 것이 원인이었습니다.

원본 WebGL 산출물을 Windows `tar.exe`로 다시 압축해 ZIP 엔트리를 `/` 경로로 교정했습니다. 루트 `index.html`, `Build/`와 `TemplateData/` 파일, CRC와 해시를 검증한 뒤 새 파일을 업로드했고, 공개 iframe에서 loader·data·framework·wasm 요청과 실제 플레이 화면이 정상 동작하는 것을 확인했습니다.

### 입력 충돌과 튜토리얼 판정

기존에는 점프, 스킬, 고용 입력의 역할이 겹칠 가능성이 있었습니다. Space와 Gamepad A를 점프 전용으로 분리하고 스킬은 C/RB, 고용은 E/Y로 재배치했습니다. 튜토리얼도 단순 이동 거리만 검사하지 않고 1.5m 이동과 실제 점프를 모두 수행해야 첫 단계가 완료되도록 수정했습니다.

## Development Roadmap

| 단계 | 목표일 | 완료 게이트 | 현재 상태 |
| --- | --- | --- | --- |
| 규칙·기술 결정 | 2026-07-23 | 핵심 규칙 승인, Fusion 2인 접속 스파이크 | 진행 중 |
| 오프라인 버티컬 슬라이스 | 2026-07-31 | 한 PC에서 5분 경기 루프 완주 | 부분 구현 |
| 1:1 네트워크화 | 2026-08-14 | 두 PC에서 동기화 경기 10회 연속 완주 | 대기 |
| 로스터·경제·콘텐츠 | 2026-08-28 | 4헌터·4몬스터·고용·점수 규칙 완성 | 계획 |
| UX·밸런스·성능 | 2026-09-11 | 신규 플레이어 완주와 성능 기준 통과 | 계획 |
| 출시 후보 | 2026-09-18 | P0/P1 결함 0개, 배포 가능한 Windows 빌드 | 계획 |

## Project Document

- [Action Hunters 프로젝트 기록 — Notion](https://south-comic-1a2.notion.site/39e068d6f71e80b6a267d3bae70a7c1d?v=3a4068d6f71e80efb7fd000c2bc84c70&pvs=74)
- [초기 기획안 — Notion](https://app.notion.com/p/3a4068d6f71e80ef9286f7eb8c2551aa)
- [MVP 실행계획 — Notion](https://app.notion.com/p/3a4068d6f71e815089e3c5fc4d2499a9)
- [점프·맵 기믹 구현 및 WebGL 배포 결과 — Notion](https://app.notion.com/p/3a5068d6f71e81fab26ffa55c4979f64)
- [Photon Fusion 1:1 네트워크 계획 — Notion](https://app.notion.com/p/3a4068d6f71e816a9429da2f6d070ec2)
- [의사결정 로그·리스크 등록부 — Notion](https://app.notion.com/p/3a4068d6f71e8117b3b7df07d6ac9ce0)

## Project Status

**현재 상태: 진행 중**

2026년 7월 22일 기준으로 점프, 전투, 헌터 AI, 고용과 전환, 원소 스테이션, Jump Pad, Pipe, Flag, HUD와 온보딩을 포함한 오프라인 버티컬 슬라이스를 공개했습니다. WebGL 배포 장애도 복구해 itch.io에서 실제 플레이를 검증했습니다.

다음 핵심 게이트는 Photon Fusion Host/Client 두 인스턴스가 같은 세션에 접속하고, 플레이어 이동과 경기 상태를 동기화하는 것입니다. 설치와 App ID 설정은 완료했지만, 실제 2인 접속과 Windows 빌드 호환성 검증은 아직 남아 있습니다. 이후에는 호스트 권한 기반 전투·경제·점수 동기화, 10경기 연속 완주, 밸런스와 성능 검증을 순서대로 진행합니다.

## Project Term

- **진행 방식:** 규칙과 기술 스파이크 → 오프라인 버티컬 슬라이스 → Photon Fusion 1:1 네트워크화 → 로스터·경제·콘텐츠 확장 → UX·밸런스·성능 검증 → 출시 후보 순서로 진행합니다.
- **기록 및 관리:** 경기 규칙, 네트워크 권한, 작업별 완료 조건, 검증 결과, 배포 정보와 장애 해결 과정을 Notion 실행계획과 구현 결과 페이지에 연결해 관리합니다.

