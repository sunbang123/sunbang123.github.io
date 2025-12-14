---
layout: post
title: "Computer network 15-2"
date: 2025-06-23 06:33:37 +0900
categories: 
tags: ["Computer Network", "computer-science"] 
---

**0. OSI 7계층 모델**
*Open Systems Interconnection: 개방형 상호연결 참조 모델*

1. **Physical (물리)**: 비트↔전기·광 신호 변환, preamble/SFD 처리
2. **Data Link (데이터 링크)**:

   * LLC: 흐름·오류 제어, 상위층 인터페이스
   * MAC: 프레임 생성·주소 지정·FCS 검사·매체 접근 제어
3. **Network (네트워크)**: IP 라우팅·패킷 전달
4. **Transport (전송)**: TCP/UDP 종단 간 신뢰성·흐름 제어
5. **Session (세션)**: 통신 세션 설정·관리·해제
6. **Presentation (표현)**: 인코딩/디코딩, 압축/암호화
7. **Application (응용)**: 애플리케이션 인터페이스, 하위로 데이터 전달

---

**15장. LAN(Local Area Network) 개관**


## 1. Network의 종류

1. **거리에 따른 분류**

   * **LAN**: 1 km 이내
   * **MAN**: 도시 규모
   * **WAN**: 1 km 이상
   * (이미 배운 packet switching 사용)
2. **Switching의 유무에 따른 분류**

   * **Switched network**: Circuit/Packet switched
   * **Broadcast network**: LAN, MAN

---

## 2. WAN·MAN·LAN 개관

* **WAN**: ≥1 km, 공중망/사설망, Kbps·높은 error rate
* **MAN**: 도시 내 여러 LAN 묶음, 높은 전송률
* **LAN**: ≤1 km, 자체 소유, 20→100→1 Gbps 진화, 오류율 10⁻⁸

---

## 3. LAN과 MAN의 공통 특징

1. Packet broadcasting network
2. 송신은 packet 형태

---

## 4. LAN·MAN 성질 결정 3요소

1. 전송매체: Twisted pair, Coaxial, Fiber optic, Microwave, Satellite
2. Topology: Ring, Bus, Star, Tree
3. MAC 프로토콜: Round Robin, Reservation, Contention, CSMA/CD, Token Ring, Token Bus, DQDB

---

## 5. LAN의 배경 및 활용

### 5.1 개인용 PC LAN

* 워크스테이션↔서버 자원 공유, Low cost→Limited rate

### 5.2 Backend Networks

* 메인프레임↔저장장치, ≥100 Mbps, 분산 접근, 수십 디바이스

### 5.3 SAN

* 저장 전용망(디스크·테이프·CD Array)

### 5.4 고속 사무실 네트워크

* 이미지 처리, High capacity storage

### 5.5 Backbone LAN

* 저속 LAN 상호연결, Reliability/Capacity/Cost 해결

---

## 6. 토폴로지와 전송매체

* 결정 요소: Protocol architecture, Topologies, MAC, LLC

### 6.1 Topologies

* Tree, Bus, Ring, Star

#### 6.1.1 Bus/Tree

* 멀티포인트 매체+탭, full-duplex, 종단기 필요, 수신자 지정·충돌 문제

#### 6.1.2 Ring

* 리피터 점대점, unidirectional, 순환 후 제거, MAC 제어

#### 6.1.3 Star

* 스테이션↔허브, Physical star/logical bus or 스위칭

### 6.2 토폴로지 선택

* 고려: 신뢰성, 확장성, 성능, 매체, 배선, MAC
* Bus LAN 매체: Twisted pair, Baseband/Broadband coaxial, Optical fiber

### 6.3 전송매체 선택

* LAN 토폴로지 제한, 전송용량·신뢰성·데이터 타입·환경 영향

---

## 7. IEEE 802 프로토콜 구조

### 7.1 IEEE 802 reference model (참조모델)

* LAN의 표준 명세(specification) 결정

  * IEEE 802.3 CSMA/CD
  * IEEE 802.5 Token Ring
  
* OSI 하위 계층 정의

  * Physical layer (물리층)
  * Logical link control (LLC)
  * Media access control (MAC)
* OSI 상위층 프로토콜(3계층·4계층 이상)은 네트워크 구조에 독립적이며 LAN, MAN, WAN 적용 가능

### 7.2 매체 접근 제어

* 제어 위치: 중앙집중 vs 분산
* 제어 방식: 동기식(TDM/FDM) vs 비동기식(Round-Robin/Reservation/Contention)

#### 7.2.1 비동기식 (Asynchronous)

1. **Round-Robin (15.3.3.1)**

   * 모든 스테이션에게 차례로 전송 기회 제공
   * 중앙집중형(폴링) 또는 분산 방식으로 수행
2. **Reservation (15.3.3.2)**

   * 스트림 트래픽에 적합
   * 시간 슬롯을 미리 예약하여 전송
3. **Contention (15.3.3.3)**

   * 전송 차례를 제어하지 않고 모든 스테이션이 경쟁
   * 버스티 트래픽에 적합
   * 적정한 부하(moderate load)에서는 효율적
   * 부하가 많을 때는 성능 저하

*중앙집중형과 분산형 방식이 일부 쓰이지만, 라운드 로빈 기법과 경쟁 기법이 일반적이다.*

#### 7.2.2 MAC Frame

* LLC PDU + MAC control, DA, SA, CRC(FCS), MAC 에러 검출·프레임 폐기

#### 7.2.3 MAC 주소 (Media Access Control Address)

* 네트워크 카드의 48비트 하드웨어 주소(LAN 카드 고유 주소), 이더넷 주소 또는 토큰링 주소와 동일
* 앞 3바이트는 OUI(Organizationally Unique Identifier)로 제조사 식별
* 뒤 3바이트는 개별 장치 식별
