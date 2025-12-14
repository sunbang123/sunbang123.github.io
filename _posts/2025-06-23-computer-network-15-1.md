---
layout: post
title: "Computer network 15-1"
date: 2025-06-23 06:33:37 +0900
categories: 
tags: ["Computer Network", "computer-science"] 
---

# 15장. LAN(Local Area Network) 개관 정리

## 📡 Network의 종류

### 거리에 따른 분류

- **LAN (Local Area Network)**: 1km 이내
- **MAN (Metropolitan Area Network)**: 도시 규모
- **WAN (Wide Area Network)**: 1km 이상 광역

### Switching 방식에 따른 분류

**Switched network**
- Circuit switched network
- Packet switched network

**Broadcast network** (LAN, MAN)

## 🌐 각 네트워크의 특징

### WAN (Wide Area Network)
- 1km 이상의 넓은 지역에서 이용되는 원거리/광역 통신망
- 제3자(네트워크 사업자)에 의해 제공되는 공중망/사설망
- 전송속도: Kbps 단위, error rate가 높음

### MAN (Metropolitan Area Network)
- 한 도시 내의 분산된 여러 통신망을 하나로 묶는 대도시 통신망
- 높은 데이터 전송률을 가지지만 넓은 영역 서비스
- 도시 각지에 분산된 여러 LAN을 포함

### LAN (Local Area Network)
- 1km 이내 좁은 지역의 컴퓨터 시스템 간 데이터 통신을 위한 근거리 통신망
- 기업, 학교, 회사 등 기존 설비를 쓰는 단체에서 소유
- 전송속도: 20Mbps → 100Mbps → 1Gbps로 진화
- 전송용량이 WAN보다 크고 오류율이 낮음

**오류율 비교:**
- LAN 오류율: 1:10⁸
- WAN 오류율: 1:10³~10⁵

## 🔧 LAN과 MAN의 성질을 정하는 3가지 요소

### 1. 전송매체 (Transmission Medium)
- **Twisted pair**: 트위스트 페어
- **Coaxial cable**: 동축케이블
- **Fiber optic cable**: 광섬유케이블
- **Microwave**: 마이크로웨이브
- **Satellite**: 위성

### 2. Topology (토폴로지)
- **Ring**: 링형
- **Bus**: 버스형
- **Star**: 성형
- **Tree**: 트리형 (bus + star)

### 3. 매체 액세스 제어 프로토콜 (MAC Protocol)
- **Round Robin**: 라운드로빈
- **Reservation**: 예약
- **Contention**: 경쟁
- **CSMA/CD**: 이더넷에서 사용
- **Token ring**: 토큰링
- **Token bus**: 토큰버스
- **DQDB**: Distributed Queue Dual Bus

## 🖥️ LAN의 배경과 활용

### 15.1.1 개인용 컴퓨터 LAN
- 워크스테이션-워크스테이션 또는 워크스테이션-중앙서버 연결
- 가격이 싼 프로그램은 개인용 PC에 설치
- 용량이 큰 프로그램은 중앙에 저장
- 구성원이 작업 내용을 공유
- 값비싼 자원(디스크, 레이저프린터 등) 공유
- **요구사항**: 저렴한 가격, 제한된 성능

### 15.1.2 후미네트워크 (Backend Networks)
- 큰 회사나 연구시설에서 사용
- 메인프레임 컴퓨터나 대용량 저장장치를 상호연결

**특징:**
- High data rate (100Mbps 이상)
- High speed interface
- Distributed access (분산 접근)
- Limited distance
- Limited number of devices (수십 개 이내)

### 15.1.2 저장영역 네트워크 (SAN: Storage Area Networks)
- 저장에 관한 요구를 처리하는 별도의 네트워크
- 하드디스크, 테이프, CD Array 등을 연결

### 15.1.3 고속의 사무실 네트워크
- Desktop image processing
- 그래픽 프로그램
- High capacity local storage

### 15.1.4 백본 랜 (Backbone LANs)
- 저속의 LAN을 상호 연결

**단일 LAN의 단점:**
- **Reliability**: 전체가 고장 나는 경우 사용자 불편
- **Capacity**: 네트워크 장비가 늘어나면 용량 포화
- **Cost**: 다양한 요구를 만족시키지 못함

## 🔗 토폴로지 상세 설명

### 15.2.1.1 버스와 트리 토폴로지
- 멀티포인트 매체 사용
- 노드는 **탭(Interface Hardware)**을 통하여 선형 전송매체에 접속
- 스테이션과 탭 사이는 전이중 통신 지원
- 스테이션에서 전송한 데이터는 양방향으로 전파
- 버스 끝에는 종단기(Terminator) 설치

**두 가지 문제점:**
1. 모든 노드에서 수신 가능 → 수신자 지정 필요 (고유 주소)
2. 동시 전송 시 신호 왜곡 → 충돌(collision) 발생

**해결방법:**
- 데이터를 작은 블록(프레임)으로 나누어 전송
- 상호 협력적인 방법으로 순서를 바꿔가며 전송

### 15.2.1.2 링 토폴로지
- 전송매체 중간에 리피터 설치
- 리피터를 점대점 형식으로 연결하여 폐쇄회로 생성
- **한 방향(unidirectional)**으로만 데이터 전송
- 리피터는 한쪽 링크에서 데이터를 받아 다른 쪽으로 전송
- 프레임은 모든 스테이션을 통과
- 목적지는 주소를 인식하고 프레임을 복사
- 프레임은 발신지로 돌아가서 제거

### 15.2.1.3 성형(Star) 토폴로지
- 각 스테이션이 **중앙 노드(Central Node/Hub)**에 직접 연결
- 스테이션과 중앙 노드 사이에 두 개의 점대점 링크 (송신용/수신용)

**두 가지 동작 방식:**
1. **브로드캐스트**: Physical star, logical bus
2. **교환 디바이스**: 중앙 노드가 스위치 역할

## 📡 전송매체 종류

### Bus LAN에 사용되는 4가지 전송매체

#### 1. 트위스트 페어 (Twisted Pair)
- 1Mbps 정도의 속도
- 초기 LAN에 사용
- 공유매체에서 높은 속도에 부적합하여 사용 중단

#### 2. 베이스밴드 동축케이블 (Baseband Coaxial Cable)
- 디지털 신호 전송
- 원래의 이더넷(Ethernet)/IEEE802.3에서 사용
- 멘체스터 또는 차동 멘체스터 인코딩 사용
- 케이블 주파수 스펙트럼 전체 사용 (단일 채널)
- 양방향 신호 전파
- 몇 km 정도 거리
- 저항: 50 ohm

**10Base5 (Thick Ethernet):**
- 반지름 0.4인치, 10Mbps
- 최대 세그먼트 길이: 500m
- 탭 간격: 2.5m의 정수배
- 최대 100개 탭

**10Base2 (Thin Ethernet):**
- 0.25인치 케이블 (더 유연함)
- 최대 세그먼트 길이: 185m
- 최대 30개 탭
- 더 저렴하지만 신호 손실 크고 잡음에 약함

#### 3. 브로드밴드 동축케이블 (Broadband Coaxial Cable)
- 원래 케이블 TV용
- 아날로그 신호 전송
- IEEE 802.3 규격에 포함되어 있지만 거의 사용 안 함

#### 4. 광섬유 (Optical Fiber)
- 비싸고 사용이 어려워 사용되지 않음

## 🏗️ IEEE 802 프로토콜 구조

### 계층 구조

#### 물리층 (Physical Layer)
- Encoding/decoding
- Preamble generation/removal
- Bit transmission/reception
- 전송매체와 토폴로지 명세 포함

#### MAC층 (Media Access Control)
- 전송 시 데이터에 주소와 에러 검출 필드를 추가하여 프레임 생성
- 수신 시 프레임을 받아서 주소인식과 에러 검출
- LAN 전송매체에 대한 접근 통제

#### LLC층 (Logical Link Control)
- 상위 층에 대한 인터페이스 제공
- 흐름제어 (Flow Control)
- 에러제어 (Error Control)

## 🚦 매체 접근 제어 (MAC Protocol)

### 분류 기준

#### "어디서" 제어하는가?

**중앙집중형:**
- 스테이션에게 네트워크 접근 권한을 부여하는 제어기가 존재
- 우선순위, 오버라이드, 대역폭 보장 등의 제어 가능
- 통제가 잘되고 스테이션의 접근 논리가 간단
- 제어기 고장 시 전체 네트워크 정지, 병목현상 가능

**분산형:**
- 모든 스테이션이 일괄적으로 매체 접근 제어 기법 수행

#### "어떻게" 제어하는가?

**동기식 (Synchronous):**
- 접속을 위해 정해진 용량을 할당
- 회선교환, FDM, TDM 등

**비동기식 (Asynchronous):**
- 통신 요청 발생 시 용량 할당
- 라운드로빈/예약/경쟁 방식

### 데이터 트래픽 종류
- **스트림 데이터**: 길고 연속적인 특성 (음성 통신, 원격측정, 대용량 파일)
- **버스티 데이터**: 짧고 산발적인 특성 (터미널과 호스트 간 트래픽)

### 비동기식 제어 방법

#### 1. 라운드로빈 (Round Robin)
- 모든 스테이션에게 차례로 전송 기회 제공
- 중앙집중형(폴링) 또는 분산 방식
- 많은 스테이션이 데이터를 보낼 때 유리

#### 2. 예약 (Reservation)
- 스트림 트래픽에 적합
- 시간을 슬롯으로 나누어 미리 예약
- 동기 시분할 멀티플렉싱과 유사

#### 3. 경쟁 (Contention)
- 전송차례를 제어하지 않음
- 모든 스테이션이 전송을 위해 경쟁
- 버스티 트래픽에 적합
- 분산 방식, 구현이 쉬움
- 적정 부하에서 효율적, 과부하 시 성능 저하

## 📦 MAC Frame 구조

### MAC 계층의 역할
LLC 계층의 데이터(LLC PDU)를 받아서 다음을 추가:

- **MAC control**: MAC 프로토콜 수행에 필요한 제어 정보
- **Destination MAC address**: 목적지 LAN의 수신자 물리적 부착점
- **Source MAC address**: 발신자의 물리적 부착점
- **CRC**: 순환 중복 검사 필드 (FCS Field라고도 함)

### MAC 주소
- 네트워크 카드의 48비트 하드웨어 주소
- 이더넷 주소 또는 토큰링 주소와 동일
- 앞의 3바이트는 OUI(제조사 구분)
- 뒤의 3바이트는 개별 장치 구분

**참고**: MAC 계층은 프레임의 에러를 검출하고 프레임을 버리며, LLC 계층은 프레임을 재전송합니다.