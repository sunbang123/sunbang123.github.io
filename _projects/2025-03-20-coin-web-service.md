---
layout: project
title: "코인 시세 조회 웹 서비스"
date: 2025-03-20
description: "실시간 암호화폐 시세 조회 및 회원제 시스템을 동반한 웹 서비스 개발 (프론트엔드 UI 및 통신 연동)"
thumbnail: "/assets/images/thumbnail/coin-web-service.png"
icon: ""
tags: ["TypeScript", "React.js", "Java", "Spring Boot", "AWS EC2", "WebSocket", "Supabase"]
demo_url: "https://www.youtube.com/watch?v=Bx098w793TE"
github_url: "https://github.com/sunbang123/bitcoin_trading_simulation"
status: "completed"
---

# 코인 시세 조회 웹 서비스

### Project Title: 코인 시세 조회 웹 서비스

> 프로젝트 대시보드 Preview 이미지

> <h4><a href="#">상세한 아키텍처 보러가기</a></h4>

* * *

### 프로젝트의 탄생
사용자가 암호화폐 시장의 흐름을 지연 없이 파악하고 안전하게 서비스를 이용할 수 있도록, 실시간 시세 조회 기능과 회원제 시스템을 결합한 코인 시세 조회 웹 서비스를 3인(프론트엔드 2인, 백엔드 1인) 팀 프로젝트로 기획하게 되었습니다.

## Project Overview
**목적:** 
TypeScript와 React.js를 활용하여 반응형 프론트엔드 UI를 구축하고, 백엔드 서버(Spring Boot)와 WebSocket 및 REST API로 연동하여 지연 없는 실시간 코인 시세 수신 로직과 클라우드 DB 기반의 회원제 시스템을 구현합니다. (본인 역할: 프론트엔드 UI 설계 및 통신 연동 담당)

**핵심 구현 기능:**
1. **실시간 시세 차트 및 호가창 연동:** React.js를 활용해 반응형 UI를 구축하고, 백엔드 서버와 WebSocket 및 REST API로 연동하여 KRW-BTC 1분봉 차트와 매수/매도 호가 데이터를 지연 없이 실시간으로 수신 및 화면에 렌더링합니다.
2. **클라우드 기반 RDBMS 및 회원제 시스템 구축:** 클라우드 환경의 Supabase 무료 플랜을 도입하여 PostgreSQL 기반 관계형 데이터베이스(RDBMS) 환경을 구축하고 회원가입 시스템을 연동합니다.
3. **디버그 패널을 활용한 통신/토큰 검증:** AWS EC2 기반의 백엔드 배포 환경에서 프론트엔드 화면 내에 디버그 패널을 구성하여, API 통신 상태(응답코드 200) 모니터링 및 Access Token 검증 테스트를 수행합니다.

## Project Document

목표: 프로젝트 아키텍처 설계 및 트러블슈팅 기록 관리 (Notion)

## Tech Stack

- **UI & Control:** TypeScript, React.js
- **Core System Logic:** Java, Spring Boot, AWS EC2, REST API, WebSocket, Supabase (PostgreSQL 기반)
- **Documentation:** 기능 명세서, WBS, 화면 설계서, 데이터베이스 ERD

## Project Term
- **진행 방식 (작게 시작하기):** 기획(요구사항 분석 및 WBS/화면 설계서 제작) ➔ 설계(데이터베이스 ERD 설계 및 Supabase DB 구축) ➔ 개발(React.js 반응형 UI 구축 및 WebSocket/REST API 실시간 로직 연동) ➔ 배포(AWS EC2 배포 및 디버그 패널 통한 API/토큰 검증)의 4단계 프로세스로 체계적인 개발을 진행합니다.
- **기록 및 관리:** 프로젝트 시작 시 요구사항 및 기능 명세서, WBS, 화면 설계서, ERD를 꼼꼼히 설계하여 문서로 관리하며, 실제 배포 단계에서는 자체 제작한 디버그 패널을 통해 서버 응답 상태 및 토큰 정보를 테스트하고 검증합니다.