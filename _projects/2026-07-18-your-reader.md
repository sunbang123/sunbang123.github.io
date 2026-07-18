---
layout: project
title: "Your Reader"
date: 2026-07-15
description: "AI 독자가 감정을 읽고 공감의 답장과 영문 번역을 건네는 감성 에세이 서재"
thumbnail: "/assets/images/thumbnail/your-reader.png"
icon: "fas fa-book-open"
tags: ["Next.js", "React", "TypeScript", "Hugging Face", "Supabase", "Vercel", "AI"]
demo_url: "https://your-reader.vercel.app"
github_url: ""
status: "in-progress"
---

# Your Reader

### Project Title: 당신의 독자 — 마음을 읽어주는 가상의 에세이 서재

> 글을 평가하거나 고치는 대신, 사용자의 감정을 온전히 읽고 따뜻한 감상과 답장을 건네는 AI 기반 글쓰기 서비스입니다.

> <h4><a href="https://your-reader.vercel.app">운영 서비스 바로가기</a></h4>

* * *

### 프로젝트의 탄생

기존의 AI 글쓰기 도구는 문법 교정이나 더 나은 문장 제안에 집중하는 경우가 많습니다. Your Reader는 이와 달리 일기나 에세이를 통해 자신의 감정을 정리하고 싶은 사용자가 평가받는 부담 없이 글을 쓰고, 자신이 선택한 가상의 독자에게 공감받는 경험을 제공하기 위해 시작했습니다.

## Project Overview

**목적:**

차분한 에디터에서 글을 작성하고 독자 페르소나를 선택하면, Hugging Face 모델이 글의 감정과 인상적인 문장을 분석합니다. 분석 결과는 감정 점수와 하이라이트로 시각화되며, 선택한 독자의 성격과 말투가 반영된 답장으로 전달됩니다. 영어 번역과 외국인 펜팔 답장까지 함께 제공해 사용자의 이야기를 다른 언어로 다시 만나는 경험도 구현했습니다.

**핵심 구현 기능:**

1. **독자 페르소나 선택:** 차분한 경청자 `다온`, 외국인 펜팔 `Alex`, 사색적인 밤의 사서 `해온` 중 글을 읽어줄 독자를 선택합니다.
2. **AI 감정 분석:** 안도·그리움·긴장·기쁨의 네 가지 감정 축과 지배 감정, 감정별 근거, 두 문장 이내의 ‘마음의 결’을 생성합니다.
3. **공감의 시각화:** AI가 고른 인상적인 문장을 원문에서 다시 찾아 형광펜으로 강조하고, 감정 점수를 막대그래프로 보여줍니다.
4. **페르소나 기반 답장:** 훈계나 심리 진단을 피하고 글의 구체적인 문장과 정서를 반영한 공감 답장을 생성합니다.
5. **외국인 펜팔 경험:** 한국어 에세이의 감정선을 살린 영문 번역과 Alex의 영어 답장을 함께 제공합니다.
6. **나만의 서재:** 이메일 인증, 800ms 디바운스 자동 저장, 글 목록 조회·수정·삭제, 처리 상태 표시와 완료된 AI 결과 재조회를 지원합니다.

## System Architecture

사용자 브라우저의 Next.js 애플리케이션이 Supabase Auth와 Data API를 통해 인증 및 글 CRUD를 처리합니다. 분석 요청은 Next.js Route Handler가 사용자의 인증과 글 소유권을 다시 확인한 뒤 Hugging Face Inference Providers를 순차 호출합니다. 검증을 마친 감정 분석, 독자 답장, 영문 번역 결과는 Supabase PostgreSQL에 저장되어 다시 열어볼 수 있습니다.

- `POST /api/entries/[id]/analyze`: 인증 및 소유권 확인 후 AI 분석 파이프라인 실행
- `GET /api/entries/[id]/result`: 저장된 분석 결과 재조회
- Supabase RLS와 명시적인 소유권 조건을 함께 적용해 사용자별 글과 분석 결과를 분리
- `HF_TOKEN`은 서버 환경 변수로만 관리하고 브라우저 번들에는 노출하지 않음
- 모델의 JSON 응답을 파싱한 뒤 필수 필드, 감정 점수 범위, 하이라이트 원문 일치 여부를 검증

## Tech Stack

- **Frontend:** Next.js 15 App Router, React 19, TypeScript
- **Backend:** Next.js Route Handler, Supabase Auth, Supabase PostgreSQL
- **AI:** Hugging Face Inference Providers, Qwen/Qwen2.5-7B-Instruct
- **Infrastructure:** Vercel, Supabase RLS
- **Design & Documentation:** Figma, FigJam, Notion

## Validation

- 실제 Hugging Face 모델을 이용한 감정 분석, 원문 하이라이트, 한국어 답장, 영문 에세이 번역, Alex 영어 답장 생성 확인
- 인증되지 않은 결과 API 요청에 대한 HTTP 401 응답 확인
- 감정 점수 보정, AI JSON 파싱, 원문 문장 대체, AI 호출 순서를 자동 테스트로 검증
- Next.js Production 빌드와 Vercel Production 배포 완료
- 운영 서비스: [your-reader.vercel.app](https://your-reader.vercel.app)

## Trouble Shooting

### AI 응답 파싱으로 인한 502 오류

모델이 정상 JSON 뒤에 설명이나 두 번째 JSON을 덧붙였을 때, 기존 파서가 전체 구간을 하나의 JSON으로 처리해 분석 API가 502를 반환했습니다. 응답을 앞에서부터 탐색해 첫 번째로 완성된 JSON 객체 또는 배열의 경계를 찾도록 파서를 개선했고, 문자열 내부 괄호와 이스케이프 문자까지 포함한 회귀 테스트를 추가했습니다.

### 영문 번역에 다른 언어가 섞이는 문제

다국어 모델의 코드 스위칭과 출력 검증 부족으로 영문 결과에 중국어가 혼입되는 사례를 확인했습니다. 영어 전용 프롬프트 강화, CJK 문자 후처리 검사, 감지 시 제한된 자동 재시도, 번역 단계의 temperature 조정을 후속 작업으로 진행하고 있습니다.

### Hugging Face 크레딧 소진

Inference Providers의 월간 크레딧 소진으로 상위 API가 402를 반환했지만, 서비스 화면에는 일반 502 오류로 표시되는 문제를 확인했습니다. 402 상태를 별도로 처리해 정확한 안내를 제공하고, 크레딧 충전·제공자 변경·자체 호스팅 모델 전환을 비교 검토하고 있습니다.

## Project Document

- [Your Reader 프로젝트 기록 — Notion](https://south-comic-1a2.notion.site/39e068d6f71e80b6a267d3bae70a7c1d?v=39e068d6f71e80bab76c000c5102b417)
- [Your Reader UI Design — Figma](https://www.figma.com/design/Rjma76VUQldJ6YbCh69L1I/Your-Reader?node-id=3-51)
- [Your Reader System Architecture — FigJam](https://www.figma.com/board/nDbx8GI3K5jxUbTeJS05H9)

## Project Status

**현재 상태: 진행중**

v0.2.0에서 인증, 자동 저장, AI 분석, 공감 답장, 영문 번역, 결과 저장과 운영 배포까지 핵심 흐름을 완성했습니다. 현재는 다음 항목을 중심으로 운영 품질과 회고 경험을 개선하고 있습니다.

- AI 응답 지연을 자연스럽게 보여주는 단계별 읽기 애니메이션
- 모델 오류와 사용량 제한에 대한 재시도·백오프 및 사용자 안내
- 번역 결과의 영어 전용 검증과 자동 교정
- 과거 감정 변화와 월간 통계 리포트
- 긴 글의 문단별 분석 및 번역
- 생성 결과 피드백과 프롬프트 버전별 품질 비교

## Project Term

- **진행 방식:** 기획과 화면 설계 → 인증·글 저장 MVP → 실제 AI 파이프라인 → 운영 배포 → 트러블슈팅 및 품질 개선의 단계로 확장했습니다.
- **기록 및 관리:** 기능 명세, 산출물, 검증 결과, 배포 정보와 장애 원인·해결 과정을 Notion에 버전별로 기록하고 있습니다.
