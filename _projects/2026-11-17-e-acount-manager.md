---
layout: project
title: "Ecount Manager"
date: 2026-11-17
description: "Ecount 공식 Open API로 품목·재고를 조회하고, 상담 메모를 함께 관리하는 영업팀용 Windows 데스크톱 앱"
thumbnail: "/assets/images/thumbnail/ecount-manager.png"
icon: "fas fa-boxes"
tags: ["C#", ".NET 8", "WPF", "MVVM", "Ecount Open API", "Windows"]
demo_url: ""
github_url: "https://github.com/sunbang123/EcountManager"
status: "in-progress"
---

# Ecount Manager

### Project Title: Ecount ERP 품목·재고 조회 및 상담 메모 관리 도구

> 영업팀이 전화 상담 중 필요한 품목과 재고 정보를 한 화면에서 조회하고, 공식 API에서 제공하지 않는 상담 내용은 로컬 메모로 기록할 수 있는 Windows 데스크톱 앱입니다.

> <h4><a href="https://github.com/sunbang123/EcountManager">GitHub 저장소 바로가기</a></h4>

* * *

### 프로젝트의 탄생

영업 상담 중에는 품목 정보, 현재고와 창고별 재고를 빠르게 확인해야 하지만, 필요한 정보를 찾기 위해 Ecount ERP의 여러 메뉴를 반복해서 이동하면 상담 흐름이 끊길 수 있습니다. Ecount Manager는 공식 Open API가 제공하는 조회 기능을 하나의 화면에 모아 이 과정을 단순화하기 위해 시작했습니다.

초기에는 거래처, 판매 이력, 채권, 최근 구매단가까지 포함한 통합 상담 화면을 구상했습니다. 그러나 공식 공개 API의 조회 범위를 확인한 결과 외부에서 안정적으로 연동할 수 있는 데이터가 제한적이었습니다. 실제로 제공되지 않는 정보를 샘플 데이터로 표현하지 않고, 품목과 재고처럼 공식 API로 확인 가능한 범위에 집중하도록 제품 범위를 재정의했습니다.

고객 상담 기록은 Ecount 데이터와 분리된 로컬 메모 위젯으로 보완했습니다. ERP 데이터는 조회만 수행하고, 주문과 전표 등록은 기존 Ecount 웹에서 처리하는 것이 이 프로젝트의 기본 원칙입니다.

## Project Overview

**목적:**

영업 담당자가 통화 중 품목과 재고 정보를 빠르게 검색하고, 고객의 문의 내용을 별도 메모 창에 기록할 수 있도록 지원합니다. Ecount 공식 API의 제공 범위와 보안 정책을 지키면서 실무에 필요한 조회 흐름을 간결하게 만드는 것이 목표입니다.

**핵심 구현 기능:**

1. **Ecount API 인증:** 회사코드로 Zone을 자동 조회하고, 테스트·운영 서버를 구분해 로그인한 뒤 `SESSION_ID`를 발급받습니다.
2. **품목 조회:** 품목코드, 품목명, 규격, 구분, 단위, 입고·출고단가와 바코드를 조회합니다.
3. **재고 통합 화면:** 품목별 현재고와 주문 가능·재고 부족·품절 상태를 표시하고, 창고별 재고수량을 함께 확인합니다.
4. **통합 검색:** 품목코드, 품목명, 규격, 바코드와 창고명을 기준으로 결과를 필터링합니다.
5. **상담 메모 위젯:** 상호명, 전화번호와 문의내용을 기록하며, 저장된 메모의 수정과 최신순 정렬을 지원합니다.
6. **상태 요약:** 전체 품목 수, 전체 재고수량과 최근 동기화 시간을 상단 카드에 표시합니다.

## User Flow

1. 사용자가 테스트 또는 운영 서버를 선택합니다.
2. 회사코드, 인증키 발급 사용자 ID와 API 인증키를 입력합니다.
3. 앱이 회사코드에 맞는 Zone을 조회하고 Ecount 로그인을 수행합니다.
4. 발급된 세션으로 품목, 재고와 창고별 재고를 순서대로 조회합니다.
5. 응답 데이터를 화면 모델로 병합해 검색 가능한 표로 표시합니다.
6. 상담 중 필요한 내용은 별도의 Topmost 메모 위젯에 저장합니다.

API 인증키는 실행 중인 앱의 메모리에만 유지하며 설정 파일, 메모 파일, 로그 또는 Git 저장소에 기록하지 않습니다.

## System Architecture

WPF와 MVVM 패턴을 기반으로 화면, 상태와 외부 API 호출을 분리했습니다. Ecount API 응답은 JSON 필드명을 기준으로 해석하며, HTTP 오류, 빈 응답, JSON 해석 오류와 Ecount 오류 응답을 사용자 상태 메시지로 전달합니다.

```text
사용자 인증정보 입력
        │
        ▼
Zone 자동 조회
        │
        ▼
Ecount 로그인 및 SESSION_ID 발급
        │
        ├─ 품목 조회
        ├─ 재고 조회
        └─ 창고별 재고 조회
        │
        ▼
화면 모델 병합 및 검색 가능한 DataGrid 표시
```

주요 구성은 다음과 같습니다.

- `Models`: 연결 설정, 품목, 창고별 재고와 상담 메모 데이터 모델
- `Services`: Ecount API 클라이언트와 JSON 기반 상담 메모 저장소
- `ViewModels`: 메인 화면과 메모 위젯의 상태 및 명령 처리
- `MainWindow`: API 연결, 조회 결과와 요약 정보를 표시하는 메인 화면
- `MemoWidgetWindow`: 메인 창과 별도로 이동할 수 있는 상담 메모 창

상담 메모는 각 PC의 `%LocalAppData%\EcountManager\consultation-memos.json`에 저장됩니다. 앱을 다시 실행해도 유지되지만, 여러 PC 사이의 동기화는 지원하지 않습니다.

## Supported Scope

### 공식 API로 구현한 범위

- 품목코드, 품목명, 규격, 단위, 단가와 바코드 조회
- 품목별 현재고와 재고 상태 표시
- 창고코드, 창고명과 창고별 재고수량 조회
- 조회 결과 통합 검색과 최근 동기화 정보 표시
- 테스트 서버 `sboapi`와 운영 서버 `oapi` 분리

### 공식 조회 범위 밖으로 분리한 기능

- 거래처 검색
- 고객별 판매 이력
- 채권 및 미수금
- 고객별 최근 구매단가
- 판매전표 입력 담당자

공식 공개 API로 제공 여부를 확인할 수 없는 기능은 실제 연동 화면에서 제외했습니다. 주문과 전표 등록도 앱에서 처리하지 않으며 기존 Ecount 웹을 사용합니다. 발주서 조회는 공식 API 범위를 추가로 검토한 뒤 후속 기능으로 구현할 예정입니다.

## Tech Stack

- **Language & Runtime:** C#, .NET 8
- **Desktop UI:** WPF, XAML
- **Architecture:** MVVM, 서비스 인터페이스, Relay Command
- **Data & Integration:** Ecount Open API, HTTP, JSON
- **Local Storage:** JSON, `%LocalAppData%`
- **Build & Deployment:** Windows x64, Framework-dependent single-file publish
- **Documentation:** Notion, GitHub

## Security & Operations

- API 인증키를 소스 코드와 로컬 설정 파일에 저장하지 않습니다.
- 인증키를 Git 커밋과 애플리케이션 로그에 남기지 않습니다.
- Ecount 데이터의 등록·수정·삭제 API를 호출하지 않습니다.
- 테스트 서버와 운영 서버를 화면에서 명확히 구분합니다.
- 세션 만료와 API 오류를 사용자에게 상태 메시지로 안내합니다.
- 공식 조회 범위를 벗어난 기능은 미지원으로 명시합니다.
- 운영 연동 전 고정 외부 IP 정책과 회사코드별 API 호출량 제한을 확인합니다.

## Validation

- .NET 8 Release 빌드 성공
- 컴파일 오류 및 경고 0건 확인
- Windows x64 단일 실행 파일 생성 및 직접 실행 확인
- 메인 API 연결 화면과 상담 메모 위젯 표시 확인
- 전용 실행 아이콘 적용
- GitHub `main` 브랜치 Push 및 원격 저장소 동기화 완료

게시 결과물은 `artifacts/EcountManager-win-x64/EcountManager.exe`에 생성되며 크기는 약 4MB입니다. Framework-dependent 방식이므로 실행 PC에 .NET 8 Windows Desktop Runtime이 필요합니다.

현재 소스 구현과 실행 파일 검증은 완료했지만, 테스트 인증키가 준비되지 않아 실제 Ecount 계정의 응답 필드와 데이터 값은 아직 검증하지 않았습니다.

## Trouble Shooting

### 공식 API가 제공하지 않는 상담 정보

초기 화면에는 고객과 판매 이력, 채권 정보를 샘플 데이터로 표현했지만, 실제 공식 조회 API로 제공되지 않는 기능이 구현된 것처럼 보일 수 있었습니다. 샘플 화면을 제거하고 공식 API가 지원하는 품목·재고 조회에 집중했으며, 고객 상담 기록은 Ecount와 분리된 로컬 메모 기능으로 구현했습니다.

### API 인증정보의 저장 위험

API 인증키가 설정 파일이나 로그에 남으면 소스 관리 또는 PC 백업 과정에서 노출될 수 있습니다. 인증키는 WPF `PasswordBox`로 입력받아 실행 중인 프로세스 메모리에서만 사용하고, 파일과 Git에는 저장하지 않도록 경계를 정했습니다.

### 여러 PC에서 발생할 수 있는 호출량과 데이터 분산

각 영업 PC가 Ecount API를 직접 호출하므로 사용자가 늘어나면 회사코드 기준 호출 제한에 도달할 수 있습니다. 상담 메모도 PC별 JSON 파일에 저장되어 다른 PC와 자동으로 공유되지 않습니다. 운영 규모가 커질 경우 중앙 연동 서비스, 응답 캐시와 메모 동기화용 사내 저장소를 도입할 예정입니다.

## Project Document

- [Ecount Manager 개발 보고서 — Notion](https://south-comic-1a2.notion.site/Ecount-Manager-2026-11-17-41b068d6f71e8140975ee76a2276f772?pvs=74)
- [소스 코드 — GitHub](https://github.com/sunbang123/EcountManager)

## Project Status

**현재 상태: 기능 구현 및 Release 배포 완료, 실제 계정 연동 검증 대기**

버전 `0.2.0`에서 공식 Open API 인증, 품목·재고·창고별 재고 조회, 통합 검색, 상담 메모 위젯과 Windows 실행 파일 배포를 완료했습니다. 실제 Ecount 테스트 인증키를 입력하지 않은 상태이므로 프로젝트 상태는 진행 중으로 표시합니다.

다음 작업은 아래와 같습니다.

1. 테스트 서버에서 Zone 조회와 로그인 성공 확인
2. 품목, 재고와 창고별 재고의 실제 응답 필드 매핑 검증
3. 정식 인증키 발급 후 운영 서버 전환
4. 발주서 조회 기능 추가 가능성 검토
5. API 호출 캐시, 재시도와 세션 만료 처리 보강
6. 상담 메모 검색·삭제·내보내기와 중앙 동기화 검토
7. .NET 런타임이 없는 PC를 위한 self-contained 배포 검토

실제 연동 검증에 사용하는 회사코드, 사용자 ID와 API 인증키는 문서, GitHub 또는 채팅에 기록하지 않고 실행 중인 앱의 입력란에만 직접 입력합니다.

## Project Term

- **진행 방식 (작게 시작하기):** 공식 API 범위 조사 → 인증 및 Zone 조회 → 품목·재고 조회 → 통합 화면 → 상담 메모 위젯 → Release 빌드 → 실제 계정 검증 순서로 구현하고, 각 단계에서 제공 가능한 데이터와 제한을 확인합니다.
- **기록 및 관리:** 구현 범위와 검증 결과는 Notion 개발 보고서에 기록하고, 소스 코드와 배포 설정은 GitHub에서 버전 관리합니다. 인증정보와 운영 계정 데이터는 두 저장소 모두에 남기지 않습니다.
