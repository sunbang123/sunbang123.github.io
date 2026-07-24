---
layout: project
title: "API 사용 예제 만들기"
date: 2024-03-19
last_modified_at: 2026-07-24
description: "Python Tkinter와 다양한 AI API를 연동한 텍스트/이미지 생성, 분석, 편집 및 자동 작곡 데스크톱 애플리케이션 구축"
thumbnail: "/assets/images/thumbnail/python-ai-api.png"
icon: ""
tags: ["Python", "Tkinter", "OpenAI API", "DALL-E 3", "Google Cloud Vision", "Pygame", "MVC Pattern"]
demo_url: ""
github_url: ""
status: "completed"
---

# API 사용 예제 만들기

### Project Title: AI API 활용 데스크톱 애플리케이션

* * *

### 프로젝트의 탄생

이 프로젝트는 각종 AI API 활용 예제 모음 서비스로, 이미지 및 문서 식별, 이미지 드로잉, 작곡 기능 등 다양한 인공지능 기능을 사용자가 파악하기 쉽도록 데스크톱 애플리케이션 형태의 예제로 제공하기 위해 기획되었습니다.

## Project Overview
**목적:** 
Python의 Tkinter 라이브러리를 활용하고 MVC(Model-View-Controller) 패턴으로 구조를 모듈화하여, 텍스트 AI, 이미지 생성 및 분석, 이미지 편집, 문서 분석, 작곡 등 다양한 AI 기능을 하나의 프로그램에서 제공하는 사용자 친화적인 데스크톱 애플리케이션을 개발합니다.

**핵심 구현 기능:**
1. **AI 텍스트 생성 및 이미지 생성/편집:** OpenAI API와 DALL-E 3를 활용해 텍스트 문장과 프롬프트 기반 이미지를 생성하며, 마스크 지정을 통한 이미지 부분 편집, 생성된 이미지의 로컬 저장 및 공유 URL 출력 기능을 제공합니다.
2. **Cloud API 기반 이미지 및 문서 분석 식별:** Google Cloud Vision API를 연동하여 이미지 내 객체 특징과 확률을 세부적으로 식별하고, Google Cloud Natural Language API와 GPT-3.5-turbo를 결합해 문서(txt)의 구문, 감정 분석 및 주요 주제 3줄 요약 기능을 구현합니다.
3. **마르코프 체인 기반 AI 작곡 및 재생:** 마르코프 체인 알고리즘과 OpenAI API를 활용해 입력받은 키워드와 조표에 알맞은 멜로디 및 코드 진행을 생성하고, 불협화음을 조정한 결과를 Pygame 라이브러리를 통해 MIDI 파일로 저장 및 재생합니다.

## Project Document

목표: 프로젝트 아키텍처 설계 및 트러블슈팅 기록 관리 (Notion)

## Tech Stack

- **UI & Control:** Python Tkinter, Pygame
- **Core System Logic:** Python, OpenAI API (GPT-3.5-turbo, DALL-E 3), Google Cloud Vision API, Google Cloud Natural Language API, Pillow, asyncio
- **Documentation:** GitHub, Notion

## Project Term
- **진행 방식 (작게 시작하기):** 개별 API 콘솔 예제 테스트 및 프로토타입 구현으로 시작하여, MVC 패턴을 적용해 컨트롤러와 모델을 기능별(이미지, 문서, 작곡 등)로 분리하고, 최종적으로 Tkinter 메인 윈도우와 개별 창을 연결하는 방식으로 점진적 통합을 수행합니다.
- **기록 및 관리:** 개발 과정에서 직면한 API 할당량 초과, 메서드 지원 불가(다운그레이드 및 마이그레이션), 이미지 RGBA 포맷 변환 에러 등의 트러블슈팅 과정을 날짜별로 상세히 기록하고 분석하며 코드를 관리합니다.
