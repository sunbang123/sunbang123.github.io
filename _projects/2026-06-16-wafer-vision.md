---
layout: project
title: "웨이퍼 결함 탐지 및 모니터링 시뮬레이터"
date: 2026-06-16
last_modified_at: 2026-07-24
description: "가상의 반도체 웨이퍼 이미지를 분석하여 결함을 탐지하고 실시간으로 모니터링하는 소프트웨어"
thumbnail: "/assets/images/thumbnail/wafer-simulator.png"
icon: "fas fa-microchip"
tags: ["CPP", "CSHARP", "WPF", "OpenCV", "MVVM"]
demo_url: ""
github_url: "https://github.com/sunbang123/Wafer-Vision-Simulator"
status: "completed"
---

# 웨이퍼 결함 탐지 및 모니터링 시뮬레이터

### Project Title: 웨이퍼 결함 탐지 및 모니터링 시뮬레이터


<img width="1000" src="https://github.com/user-attachments/assets/677d0352-77dd-4c33-9bb6-e4a175a27f53" alt="웨이퍼 결함 탐지 및 모니터링 시뮬레이터 실행 화면" />


* * *

### 프로젝트의 탄생

## Project Overview
**목적:** 가상의 반도체 웨이퍼 이미지를 불러와, 불량 픽셀(결함)을 찾아내고 그 위치를 UI에 실시간으로 표시하는 소프트웨어를 개발합니다.

**핵심 구현 기능:**
1. **WPF 기반의 대시보드 UI:** 장비 조작 패널처럼 화면을 구성하며, MVVM(Model-View-ViewModel) 패턴을 철저히 지켜 UI와 비즈니스 로직을 완벽히 분리합니다.
2. **비전 검사 코어 알고리즘:** OpenCV를 활용해 이미지의 노이즈를 제거(블러링)하고, 엣지를 추출하여 정상 패턴과 다른 결함(스크래치나 먼지)을 찾아냅니다. 특정 구역(ROI) 내의 결함 개수를 빠르게 카운트하기 위해 구간 합 및 탐색 알고리즘을 적용합니다.
3. **C++과 C#의 연동 (Interop/DLL):** 무겁고 빠른 이미지 처리는 C++(DLL)이 전담하고, 결과 데이터(결함 좌표, 처리된 이미지)를 C#으로 넘겨받아 WPF 화면에 출력하는 구조를 구축합니다.

## Project Document

목표: 프로젝트 아키텍처 설계 및 트러블슈팅 기록 관리 (Notion)

웨이퍼_결함탐지_시뮬레이터_기획서.pdf

## Tech Stack

- **UI & Control:** C#, WPF (MVVM 패턴 적용)
- **Core Vision Logic:** C++, OpenCV
- **Documentation:** Notion

## Project Term
- **진행 방식 (작게 시작하기):** 검은색 배경에 흰색 점(결함)이 찍힌 단순한 이미지를 OpenCV로 읽어 개수를 세고 좌표를 찾는 C++ 콘솔 프로그램부터 단계적으로 구현합니다.
- **기록 및 관리:** MVVM 패턴 적용 중 발생하는 데이터 바인딩 오류나, C++과 C# 간의 데이터 변환(Marshaling) 과정에서 생기는 메모리 누수 등의 트러블슈팅 과정을 노션(Notion) 데이터베이스에 상세히 기록하며 진행합니다.
