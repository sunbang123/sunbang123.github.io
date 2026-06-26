---
layout: project
title: "AOI-System"
date: 2026-06-22
description: "웨이퍼 표면 결함 탐지를 위한 딥러닝 및 C++/C# 기반 자동 광학 검사(AOI) 시스템"
thumbnail: "/assets/images/thumbnail/aoi-system.png"
icon: ""
tags: ["AOI", "Deep Learning", "C++", "C#", "Python"]
demo_url: ""
github_url: "https://github.com/sunbang123/Wafer-AOI-Project"
status: "completed"

---

# AOI-System

### Project Title: AOI-System

> 프로젝트 대시보드 Preview 이미지

> <h4><a href="https://south-comic-1a2.notion.site/36e068d6f71e8018be6eda3126e3edae?v=383068d6f71e80a2ba35000ca9d7b38c">상세한 아키텍처 보러가기</a></h4>

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

- **UI & Control:** C# (.NET WPF).
- **Core Vision Logic:** Python 3.x, PyTorch, Google Colab, C++, OpenCV (C++), ONNX Runtime.
- **Documentation:** Git, GitHub.

## Project Term
- **진행 방식 (작게 시작하기):**
    - 모델 학습 및 최적화(Phase 1), 고속 영상처리 코어 엔진 개발(Phase 2), 장비 제어 UI 개발 및 통합(Phase 3), 디버깅 및 포트폴리오 패키징(Phase 4)의 4단계로 나누어 순차적으로 구현을 진행합니다.
- **기록 및 관리:**
    - 메모리 누수(Memory Leak)가 발생하지 않는지 검증하며, GitHub 리포지토리에 Python 학습 코드와 Visual Studio 솔루션(C++/C#)을 분리해 업로드하고 README 문서를 작성하여 관리합니다.

<hr>
<br>

## 프로젝트 산출물 v.1 (WPF)

<img width="800" alt="image" src="https://github.com/user-attachments/assets/88416609-f8ff-49c1-9380-c6099b9a5973" />

<img width="800" alt="image" src="https://github.com/user-attachments/assets/dce65fbe-6321-464a-ac79-c15b648b4748" />

## 프로젝트 산출물 v.2 (MFC)

<img width="800" alt="image" src="https://github.com/user-attachments/assets/8aa3c7c6-5700-410b-bcac-36af2638f18f" />

<img width="800" alt="image" src="https://github.com/user-attachments/assets/e1fc92db-696b-4cbf-8c0d-a49cae6dfa88" />

C# 결과보다 C++ 네이티브 UI에서 신뢰도가 더 높게 나온 이유는 모델 자체가 달라서가 아니라, 같은 이미지를 모델 입력값으로 변환하는 전처리 과정이 다르기 때문으로 해석된다. 학습 과정에서는 원본 웨이퍼 맵 배열을 `64x64` 크기로 줄인 뒤 값을 `0.0`, `0.5`, `1.0` 형태로 변환하여 모델에 입력하였다. 그러나 실행 단계에서는 저장된 PNG 이미지를 다시 읽고, 색상을 분석하여 원래의 웨이퍼 값으로 복원한다.

이때 C#은 WPF의 이미지 처리 방식을 사용하고, C++은 OpenCV의 `cv::resize()`를 사용한다. 두 방식은 눈으로 보기에는 같은 이미지를 처리하는 것처럼 보이지만, 내부적으로는 픽셀 보간 방식과 색상 처리 결과가 조금씩 달라질 수 있다. 특히 웨이퍼 이미지처럼 결함 영역이 픽셀 단위로 표현되는 경우, 리사이즈 과정에서 노란색 결함 픽셀의 개수나 위치가 달라지면 모델의 판단 점수도 변할 수 있다.

실제 파일을 확인한 결과, `scratch_wafer.png`는 `318x400` 크기의 PNG 이미지이며, 이를 `64x64`로 줄이는 방식에 따라 결함으로 해석되는 노란색 픽셀 수가 달라졌다. 따라서 C++ 쪽 전처리 결과가 이번 이미지에서는 모델이 `Loc` 클래스를 더 뚜렷하게 인식하도록 만들었고, 그 결과 C#보다 높은 confidence가 출력된 것으로 볼 수 있다.

결론적으로 본 산출물은 정상 웨이퍼와 불량 웨이퍼를 구분하는 기능이 정상적으로 동작함을 보여준다. 그러나 세부 불량 클래스 분류에서는 전처리 방식에 따라 결과와 신뢰도가 달라질 수 있음을 확인하였다. 향후 개선을 위해서는 학습 단계와 실행 단계의 전처리 방식을 최대한 동일하게 맞추는 것이 중요하다. 특히 PNG 색상 이미지를 다시 해석하는 방식보다, 원본 웨이퍼 맵 배열을 직접 입력으로 사용하는 방식이 더 안정적일 것으로 판단된다.