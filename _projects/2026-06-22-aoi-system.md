---
layout: project
title: "AOI-System"
date: 2026-06-22
description: "웨이퍼 표면 결함 탐지를 위한 딥러닝 및 C++/C# 기반 자동 광학 검사(AOI) 시스템"
thumbnail: ""
icon: ""
tags: ["AOI", "Deep Learning", "C++", "C#", "Python"]
demo_url: ""
github_url: "https://github.com/sunbang123/Wafer-AOI-Project"
status: "in-progress"

---

# AOI-System

### Project Title: AOI-System

> 프로젝트 대시보드 Preview 이미지

> <h4><a href="#">상세한 아키텍처 보러가기</a></h4>

* * *

### 프로젝트의 탄생

반도체 미세화 공정이 고도화됨에 따라 육안 검사의 한계를 극복하는 고속 및 고정밀 자동 광학 검사(AOI) 시스템이 필수적으로 요구되는 실무 배경에서 기획되었습니다.

## Project Overview
**목적:** 실제 웨이퍼 맵 데이터(WM-811K)를 활용해 표면 결함을 탐지하는 딥러닝 모델을 파이썬으로 학습시키고, 이를 C++(영상처리 엔진)과 C#(사용자 UI) 환경으로 이식하여 실제 양산 장비와 유사한 윈도우 데스크톱 검사 프로그램을 개발합니다.

**핵심 구현 기능:**
1. Kaggle의 WM-811K 데이터셋을 전처리하여 CNN이나 YOLO 모델로 결함 패턴을 학습시키고 범용 AI 포맷인 ONNX 파일로 변환합니다.
2. C++ OpenCV로 이미지 전처리를 고속 수행하며, ONNX 모델 추론 결과(불량 여부, 종류, 좌표 등)를 반환하는 `CoreVision.dll` 파일을 빌드합니다.
3. C# WPF 또는 WinForms로 작업자 화면을 구성하고 마샬링(Marshaling)을 통해 C++ DLL과 데이터를 주고받아 Bounding Box 및 통계 그래프를 실시간으로 시각화합니다.

## Project Document

목표: 프로젝트 아키텍처 설계 및 트러블슈팅 기록 관리 (Notion)

## Tech Stack

- **UI & Control:** C# (.NET WPF 또는 WinForms).
- **Core Vision Logic:** Python 3.x, PyTorch (또는 TensorFlow), Google Colab, C++, OpenCV (C++), ONNX Runtime.
- **Documentation:** Git, GitHub.

## Project Term
- **진행 방식 (작게 시작하기):** 모델 학습 및 최적화(Phase 1), 고속 영상처리 코어 엔진 개발(Phase 2), 장비 제어 UI 개발 및 통합(Phase 3), 디버깅 및 포트폴리오 패키징(Phase 4)의 4단계로 나누어 순차적으로 구현을 진행합니다.
- **기록 및 관리:** 메모리 누수(Memory Leak)가 발생하지 않는지 검증하며, GitHub 리포지토리에 Python 학습 코드와 Visual Studio 솔루션(C++/C#)을 분리해 업로드하고 README 문서를 작성하여 관리합니다.