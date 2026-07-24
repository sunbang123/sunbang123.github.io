---
layout: project
title: "스마트홈 시스템"
date: 2024-10-16
last_modified_at: 2026-07-24
description: "ESP32와 Home Assistant, ESPHome을 활용한 스마트홈 IoT 연동 및 통합 제어 시스템 구축"
thumbnail: "/assets/images/thumbnail/smart-home.jpg"
icon: ""
tags: ["Smart Home", "ESP32", "Home Assistant", "ESPHome", "Raspberry Pi", "IoT", "YAML"]
demo_url: ""
github_url: "https://github.com/sunbang123/Graduation_Project/wiki"
status: "completed"
---

# 스마트홈 시스템

### Project Title: 스마트홈 시스템

> <h4><a href="https://github.com/sunbang123/Graduation_Project/wiki">구현 문서와 아키텍처 보기</a></h4>

* * *

### 프로젝트의 탄생

생활의 편의성을 높이기 위해 ESP32 장치들과 Raspberry Pi 기반의 Home Assistant를 연동하여, 집안의 다양한 스마트 기기들을 직관적으로 원격 제어하고 관리할 수 있는 자동화된 사물인터넷(IoT) 환경을 구축하고자 기획되었습니다.

## Project Overview
**목적:** 
별도의 복잡한 설정 없이 ESP32와 Home Assistant를 전용 펌웨어 관리 툴인 ESPHome으로 통합하여 조명, 블라인드, 공조기, 알람 등 다양한 하드웨어를 중앙에서 간편하고 빠르게 제어할 수 있는 스마트홈 시스템을 구현합니다.

**핵심 구현 기능:**
1. **ESPHome 및 Home Assistant 통합 구축:** 브로커(MQTT) 없이 Home Assistant와 다이렉트로 통신하는 ESPHome을 활용하여 YAML 설정만으로 센서/장치를 통합하고, USB 연결 없이 Wi-Fi 기반으로 편리하게 무선 펌웨어 업데이트를 수행합니다.
2. **스마트 조명 및 블라인드 자동화 제어:** 서보 모터를 활용하여 창문 블라인드를 올리고 내릴 수 있도록 구성하며, RGB LED를 이용해 색상과 밝기 조절이 가능한 무드등 및 벽조명을 구현합니다.
3. **부가 편의 제어 시스템 (알람, 팬) 및 UI 모니터링:** 부저를 통해 블루투스 스피커 알람 기능을 구축하고 에어컨 팬을 On/Off 할 수 있도록 제어하며, 기기의 연동 상태 UI를 LCD 화면을 통해 직관적으로 출력합니다.

## Project Document

목표: 프로젝트 아키텍처 설계 및 트러블슈팅 기록 관리 (Notion)

## Tech Stack

- **UI & Control:** Home Assistant, LCD UI
- **Core System Logic:** ESP32, Raspberry Pi, ESPHome, YAML
- **Documentation:** GitHub, Notion

## Project Term
- **진행 방식 (작게 시작하기):** 개별 하드웨어(서보 모터, RGB LED, 부저, 팬)의 동작 테스트부터 시작하여, 최종적으로 전체 장치를 하나의 최종 YAML 설정 파일에 묶어 Home Assistant 시스템에 통합하는 방향으로 점진적 확장을 진행합니다.
- **기록 및 관리:** 하드웨어 연동 시 작성한 최종 YAML 설정 파일과 각 기능(블라인드 동작, 조명 밝기 제어, 에어컨 팬 등)의 데모 시연 영상을 GitHub 리포지토리에 분리 업로드하여 결과를 체계적으로 관리합니다.
