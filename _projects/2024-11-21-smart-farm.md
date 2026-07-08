---
layout: project
title: "스마트팜 시스템"
date: 2024-11-21
description: "ESP32, 라즈베리파이 4, Node-RED를 활용한 IoT 기반 식물 생장 모니터링 및 AI 스마트팜 시스템 구축"
thumbnail: "/assets/images/thumbnail/smart-farm.png"
icon: ""
tags: ["Smart Farm", "ESP32", "Raspberry Pi", "Grafana", "Node-RED", "MQTT", "InfluxDB", "OpenAI", "Plant.id"]
demo_url: ""
github_url: "https://github.com/sunbang123/embedded/wiki"
status: "completed"
---

# 스마트팜 시스템

### Project Title: 스마트팜 시스템

> 🗓️실습보고서

1. [Embedded Systems Overview](https://github.com/sunbang123/embedded/wiki/Embedded-Systems-Overview)

2. [Projects & Version Evolution](https://github.com/sunbang123/embedded/wiki/Projects-&-Version-Evolution)

3. [Raspbian & environment settings](https://github.com/sunbang123/embedded/wiki/Raspbian-&-environment-settings)

4. [Raspberry Pi LED practice (with Thonny IDE)](https://github.com/sunbang123/embedded/wiki/Raspberry-Pi-LED-practice-(with-Thonny-IDE))
   - [Electronic and Electric theory](https://github.com/sunbang123/embedded/wiki/Electronic-and-Electric-theory)
5.
6. [Node‐RED GPIO & dht11 in Raspberrypi5](https://github.com/sunbang123/embedded/wiki/Node%E2%80%90RED-GPIO-&-dht11-in-Raspberrypi5)
   - [Node‐RED GPIO & dht11 details](https://github.com/sunbang123/embedded/wiki/Node%E2%80%90RED-GPIO-&-dht11-details)

7. [Raspberry Pi 4 Node‐RED Dashboard and DHT11 Sensor](https://github.com/sunbang123/embedded/wiki/Raspberry-Pi-4-Node%E2%80%90RED-Dashboard-and-DHT11-Sensor)

8. [Raspberry Pi 4 with Node‐RED & DHT11 to MariaDB](https://github.com/sunbang123/embedded/wiki/Raspberry-Pi-4-with-Node%E2%80%90RED-&-DHT11-to-MariaDB)

9. [raspberry pi 4 usbcamera practice](https://github.com/sunbang123/embedded/wiki/raspberry-pi-4-usbcamera-practice)
   - [My Project : 기온에 따른 외출복 추천 시스템](https://github.com/sunbang123/embedded/wiki/My-Project-:-%EA%B8%B0%EC%98%A8%EC%97%90-%EB%94%B0%EB%A5%B8-%EC%99%B8%EC%B6%9C%EB%B3%B5-%EC%B6%94%EC%B2%9C-%EC%8B%9C%EC%8A%A4%ED%85%9C)
   - [My Project 2 : 스마트 온실 시스템(토마토 생장 모니터링)](https://github.com/sunbang123/embedded/wiki/My-Project-2-:-%EC%8A%A4%EB%A7%88%ED%8A%B8-%EC%98%A8%EC%8B%A4-%EC%8B%9C%EC%8A%A4%ED%85%9C(%ED%86%A0%EB%A7%88%ED%86%A0-%EC%83%9D%EC%9E%A5-%EB%AA%A8%EB%8B%88%ED%84%B0%EB%A7%81))

10. [IP Port forwarding, tunneling, Set domain](https://github.com/sunbang123/embedded/wiki/IP-Port-forwarding,-tunneling,-Set-domain)

11. [AIoT(Artificial Intelligence of Things)](https://github.com/sunbang123/embedded/wiki/AIoT(Artificial-Intelligence-of-Things))


* * *

# 프로젝트의 탄생

행거와 비닐을 이용하여 미니 비닐하우스 형태의 온실을 직접 제작하였으며, 빠르게 성장하는 새싹보리 등을 주요 대상으로 삼아 **식물의 생장 환경을 실시간으로 모니터링하고 농작물 생장을 최적화**하기 위해 기획되었습니다.

## Project Overview
**목적:** 
ESP32와 라즈베리파이 4를 활용하여 식물 생장에 필요한 환경 데이터를 수집하고, **Grafana와 Node-RED를 통해 시각화 및 제어를 수행함과 동시에 AI(OpenAI, Plant.id)를 활용해 식물의 건강 상태 진단까지 지원하는 통합 IoT 솔루션**을 구축합니다.

**핵심 구현 기능:**
1. **MQTT 기반 자동화 물주기 및 원격 제어:** 토양 수분 센서로 습도를 측정하고, 수치가 20% 미만일 때 ESP32에서 MQTT 신호를 보내 DC 모터(펌프)로 물을 자동 공급하며, 이 과정은 Node-RED 대시보드에서 온/오프 및 자동화 제어가 가능합니다.
2. **AI 식물 진단 및 챗봇 농장 도우미:** Plant.id API를 연동하여 사진 촬영 시 식물의 건강/질병 상태(비생물적 요인, 영양부족 등)를 분석하고, OpenAI를 활용해 말풍선 형태의 친화적인 UI로 맞춤형 농장 관리 지식을 제공합니다.
3. **데이터 로깅 및 반응형 대시보드 시각화:** 수집된 토양 습도 데이터와 AI 분석 결과를 시계열 데이터베이스인 InfluxDB에 저장하고, 모바일 및 PC에서 모두 최적화된 반응형 Node-RED 앱과 Grafana 대시보드로 실시간 연동하여 출력합니다.

## Project Document

목표: 프로젝트 아키텍처 설계 및 트러블슈팅 기록 관리 (Notion)

## Tech Stack

- **UI & Control:** Node-RED Dashboard, Grafana
- **Core System Logic:** ESP32, Raspberry Pi 4, MQTT, InfluxDB, 토양 수분센서, DC 모터, OpenAI API, Plant.id API
- **Documentation:** GitHub, Notion

## Project Term
- **진행 방식 (작게 시작하기):** 토양 수분 측정과 DC 모터를 이용한 기초적인 물주기 자동화 테스트로 시작하여, Node-RED 및 Grafana 대시보드 구축, 마지막으로 챗봇과 인공지능 식물 분석 API를 접목하는 순서로 시스템을 점진적으로 구현합니다.
- **기록 및 관리:** 흙 재배와 수경 재배의 생장 속도 및 상태를 비교한 생장 결과와 날짜/시간별 식물 관찰 영상 등을 GitHub에 업로드하여 관리하고, 진단 데이터는 InfluxDB의 특정 버킷(plant_analysis)에 체계적으로 저장합니다.