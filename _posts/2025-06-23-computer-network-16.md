---
layout: post
title: "Computer network 16"
date: 2025-06-23 06:36:18 +0900
categories: 
tags: ["Computer Network", "computer-science"]
---

# 16.2. 이더넷 (CSMA/CD) 정리

## 📡 CSMA/CD 개요

### CSMA/CD란?
- **CSMA/CD**: Carrier Sensing Multiple Access/Collision Detection
- **적용 토폴로지**: bus 또는 switched topology
- **매체접근제어**: 비동기식 방식

## 🔄 CSMA/CD 동작 과정

### 시간순 동작 설명
- **t0**: A가 전송 시작
- **t1**: A는 계속 전송, C가 전송 시작
- **t2**: C는 충돌을 감지하고 전송 중단, A는 아직 충돌을 감지 못하고 계속 전송
- **t3**: A는 충돌을 감지하고 전송 중단

### 이더넷 플로우차트 동작
1. **Frame ready?** → 전송할 프레임이 준비되었는가?
2. **Channel Busy?** → 채널이 사용 중인가?
3. **Transmit** → 전송 시작
4. **Collision detected?** → 충돌이 감지되었는가?
5. **Abort transmission** → 전송 중단
6. **Transmit jam signal** → 잼 신호 전송
7. **Compute random backoff integer R** → 랜덤 백오프 값 계산
8. **Delay R slot times** → R 슬롯 타임만큼 대기

## 📊 이더넷의 특징

### 기본 특성
- 한 노드에서 데이터는 양방향으로 전송되며, 다른 모든 노드에서 수신 가능
- 전송은 주소와 데이터를 포함한 패킷 형태
- 모든 노드에서 매체를 모니터하며, 목적지 노드에서 패킷 내용을 복사
- baseband signaling, broadband signaling 사용

### Bus 구조의 특징
- Multi-point 구성이 point-to-point(Token ring) 구성보다 성능이 낮음

**두 가지 문제점:**
1. Multi-point line 사용으로 어느 station이 전송해야 하는가 결정이 어려움
2. Signal balancing이 어려움

## 📦 Frame Format (프레임 형식)

### 8개 필드 구성 (데이터와 패딩 제외하고 고정 길이)
1. **Preamble (7 octets)**: 10101010 패턴
2. **SFD (Start of Frame Delimiter, 1 octet)**: 10101011 패턴
3. **DA (Destination Address, 2 or 6 octets)**:
   - 첫 번째 bit이 "0"이면 individual address
   - 첫 번째 bit이 "1"이면 group address
   - 전부 1이면 broadcast address
4. **SA (Source Address, 2 or 6 octets)**: 전부 같은 크기의 주소
5. **Length indicator (2 octets)**: data field의 길이 (46~1500 bytes)
6. **Data (46~1500 Bytes)**
7. **Padding**: data field 길이가 minimum frame size보다 적을 때
8. **FCS (32 bit CRC)**: Frame Check Sequence

**참고**: Octet = byte와 같은 의미 (8 bits)

## ⏰ Slot Time과 Frame 최소 길이

### Slot Time 계산
- **정의**: 노드가 전송 후 collision이 생긴 것을 발견하기 위해 기다려야 하는 시간
- **계산**: 2 × (worst case transmission path delay) + safety margin
- **예제**: 2 × 2500[m]/2E8[m] = 25[micro-sec] = 250 bits
- **안전마진**: 250 × 2 = 500[bits] → 512 bits (64 bytes)

### Frame 최소 길이
- **Frame 최소 길이**: 64 bytes
- **구성**: 6(DA) + 6(SA) + 2(Length) + 46(Data) + 4(FCS) = 64 bytes
- **MAC 주소**: DA 또는 SA는 6바이트

**교수 정정사항**: Length field 2byte는 data field(46~1500바이트)의 길이 값을 바이트로 알려주는 필드임 (전체 사이즈가 아님)

## 📤 Frame 전송 과정

### 전송 준비
- 전송할 message가 준비되면 MAC Unit에 의해 frame으로 생성
- **Carrier sense** (listen before talking): 전송매체의 carrier를 조사
- 전송매체가 사용 중이면 사용이 끝날 때까지 전송 연기
- 전송매체가 사용되지 않으면 frame 송신
- 송신 후 interframe gap만큼 대기

### 충돌 감지와 처리
- **Collision window** (= slot time) 동안 전송하면서 충돌 감시
- **Collision detection**: 정상 전압 레벨보다 훨씬 높은 전압 레벨로 검출
- 충돌 감지 시 jam sequence bit pattern 전송
- **Collision enforcement**: 다른 전송 노드들이 충돌을 확실히 감지하도록 함
- **Jam 신호**: 32~48 bit 길이의 특수한 frame

## 🔄 Frame 재전송 (Retransmission)

### Truncated Exponential Back-off
- 충돌 감지한 노드는 R slot time만큼 대기 후 재전송
- **공식**: 0 ≤ R ≤ (2^K - 1)
- **Back-Off Limit**: 10
- **K**: Min[N, Back-off Limit] (N = N번째 재전송)
- **Attempt limit**: 16 (N ≤ 16)

### 재전송 예제
- **스테이션 A**: 처음 전송 실패 후 재전송 (N=1) → K=1 → R = 0 또는 1
- **스테이션 C**: 처음 전송 실패, 1번째 재전송 실패 후 2번째 재전송 (N=2) → K=2 → R = 0,1,2,3 중 선택

### Attempt Limit의 의미
- 16번 재전송 실패 시 N=17이 되어 재전송을 중단(포기)

## 📥 Frame 수신 과정

### 수신 단계
- 전송매체의 신호 감지 시 새로운 패킷 전송 중단
- Preamble을 bit synchronization에 사용
- Bit sync 완료 후 preamble과 SFD는 버림
- DA 검사하여 frame의 나머지를 받을지 결정 (자기한테 온 frame만 수신)

### Validation Check
- FCS 계산하여 error 확인
- Frame의 전체 길이가 정수배의 octet인지 확인
- Frame의 전체 길이가 너무 길거나 짧은지 검사 (64~1518 bytes)
- 위 조건 중 하나라도 틀리면 frame을 버림

## ⚖️ CSMA/CD 장단점

### 장점 (Advantages)
- 구현이 쉽고 값이 싸다
- 트래픽이 적은 경우에 이상적
- 시스템 확장이 쉽다

### 단점 (Disadvantages)
- 매체를 무작위로 접근하는 특성 때문에 공정성이 보장되지 않음
- 시간에 민감한 응용 프로그램에는 적당하지 않음
- 트래픽이 많은 경우 지연이 증가

### 성능 특성
- 채널 전체 이용률이 30% 이하일 때 최적 상태로 동작
- 지속적으로 사용하는 환경에서는 다른 형식의 LAN이 더 효과적
- 채널 이용률이 높은 상황에서는 일반적으로 Token Ring이 CSMA/CD보다 우수

---

# 16.3. 토큰 링(Token Ring): IEEE 802.5 정리

## 🔗 토큰 링 개요

### 기본 구조
- **Ring Topology**: Station들이 Repeater를 통해 원형으로 연결
- **데이터 흐름**: 한 방향(unidirectional)으로만 전송
- **속도**: 4Mbps, 16Mbps, 100Mbps
- **전송매체**: UTP, STP(Shielded Twisted Pair), Fiber Optics

### 비트 전송 시간 계산 예제
- **4Mbps 네트워크**: 한 비트 전송 시간 = 1/4M = 0.0000025초
- 네트워크는 0.0000025초마다 한 비트씩 전송

## 🎯 링 토폴로지 운영

### Manchester Encoding
- **High에서 Low로 변화**: "0"을 나타냄
- **Low에서 High로 변화**: "1"을 나타냄

### 연결 방식
- 점대점 방식으로 연결되어 전송매체 선택이 자유로움
- Twist pair가 일반적, 동축케이블, 광섬유도 사용 가능

### 데이터 전송 특성
- Node는 repeater에 연결
- Repeater는 다른 repeater와 점대점 방식으로 연결하여 전체적으로 원형 구성
- 데이터는 패킷 형태로 오직 한 방향으로만 전송되어 ring을 순환
- 패킷에는 데이터, 발송지주소, 목적지주소, 제어정보 포함
- Repeater는 데이터를 받아서 같은 빠르기로 한 BIT씩 차례로 BUFFERING 없이 다른 link로 전송
- 1 bit delay 존재

## 📦 토큰 링 프레임 종류

### 4가지 패킷 종류
1. **Token**: 토큰
2. **MAC** (Medium Access Control): 전체 제어 목적
3. **LLC** (Link Layer Control): 정보가 들어있음
4. **Abort Sequence frames**: 앞에 간 frame 취소

## 🎫 토큰 구조

### 토큰 필드 구성 (총 24 bits)
| Starting delimiter | Access control | Ending delimiter |
|:-----------------:|:-------------:|:---------------:|
|     8 bits        |     8 bits    |     8 bits      |

### Access Control Field 상세 (8 bits: PPP T M RRR)
- **PPP (3 bits)**: Priority bits
  - "000" (low) ~ "111" (high)
  - 토큰의 priority보다 높거나 같은 노드는 토큰을 잡아서 데이터 전송 가능

- **T (1 bit)**: Token bit
  - "0": 토큰을 나타냄
  - "1": 일반 프레임(ordinary frame)을 나타냄

- **M (1 bit)**: Monitor bit
  - "1": Active monitor가 frame이 끝없이 도는 것을 방지하기 위해 사용
  - "0": node가 사용하는 token

- **RRR (3 bits)**: Reservation bits
  - 노드 중 아무도 쓰지 않으면 free token
  - 우선순위가 높은 것이 예약 시 선택됨

## 📋 일반 프레임(General Frame) 구조

### 9개 필드 구성
1. **Starting delimiter** (8 bits)
2. **Access control** (8 bits)
3. **Frame Control** (8 bits)
4. **Destination Address**
5. **Source Address**
6. **Routing information** (선택적)
7. **Data Unit** (Info)
8. **FCS** (4 bytes)
9. **Ending delimiter** (8 bits)
10. **Frame status** (8 bits)

### Frame Control Field (FFRRCCCC - 8 bits)
- **FF**: Frame Type Bits
  - 00: MAC frame
  - 01: LLC frame
  - 10, 11: reserved

- **RR**: reserved (future use)
- **CCCC**: MAC frame이 사용
  - (00)000000: normal buffered
  - (00)000001: express buffered

## 📮 주소 체계

### Destination Address
- 첫 번째 bit "0": individual address
- 첫 번째 bit "1": group address
- 전부 "1": broadcast address

### Source Address
- 언제나 individual address

### Routing Information
- Source Address와 Data Unit 사이에 있을 수 있음
- 여러 개의 링이 연결되어 있는 경우 사용

## 📏 데이터 최대 길이

### Maximum Frame Size
- **4Mbps**: 4,550 바이트
- **16Mbps**: 18,200 바이트
- **100Mbps**: 18,200 바이트

### FCS (Frame Check Sequence)
- 4 bytes
- CRC (Cyclic Redundancy Check, 순환 중복 검사)
- (FC + DA + SA + INFO)를 cover

## 🏁 Ending Delimiter와 Frame Status

### Ending Delimiter (1 byte: J K 1 J K 1 I E)
- **Token의 경우**: I=0, E=0
- **Normal frame**:
  - I=1: 여러 패킷 중의 처음 또는 중간 frame
  - I=0: 여러 패킷 중의 마지막 frame (또는 오직 frame이 하나만 있을 때)

- **E bit**:
  - Source node가 "0"으로 set
  - Node가 repeat하거나 receive하는 도중 error 발생 시 "1"로 변경

### Frame Status (1 byte: ACXXACXX)
- **A bits (Bits 0 and 4)**: Address recognized bits
  - Sender가 "00"으로 초기화
  - "11": destination node가 destination address를 인식했을 때

- **C bits (Bits 1 and 5)**: Copied bits
  - Sender가 "00"으로 set
  - "11": destination node가 패킷 내용을 input buffer로 복사했을 때

## 🔄 Repeater의 3가지 기능

### 1. Data Insertion (데이터 삽입)
- Node가 패킷을 ring topology network에 넣는 방법은 매체 액세스 제어 프로토콜에 의해 결정
- Token은 ring을 따라 도는 일종의 패킷
- 모든 station이 데이터를 전송하지 않을 때 token은 "free token" (T="0")
- 전송을 원하는 station은 "free token"이 지나가기를 대기
- "free token"을 "busy token"으로 변경 (T="1")
- Token 뒤에 패킷을 붙여 전송

### 2. Data Reception (데이터 수신)
- **일반적인 수신**: 패킷이 repeater를 통과할 때 destination address를 확인하여 자신의 주소와 같으면 복사
- **Acknowledgement 기능**: 수신 station은 token의 한 bit flag를 변경하여 송신측에 acknowledgement 전송
  - FS field의 bit 0 and bit 4를 "1"로 변경 (Address Recognized Bits)
  - FS field의 bit 1 and bit 5를 "1"로 변경 (Copied Bits)

### 3. Data Removal (데이터 제거)
- 패킷은 source node에서 제거되는 것이 유리

**이유:**
- 자동적인 acknowledgement가 가능
- 여러 station에 동시에 전송할 수 있는 multicast가 가능

## 🔄 토큰 생성과 관리

### Free Token 생성
- 스테이션은 보낼 프레임이 없을 때까지 또는 토큰을 가지고 있을 수 있는 제한 시간이 끝날 때까지 전송 계속
- 송신 station은 송신을 끝내면 token을 "free token"으로 만들어 token ring 안으로 다시 전송
- 스테이션은 전송한 AC 필드가 되돌아오면 T bit 토큰 비트를 "0"으로 하고 ED 필드를 붙이고 링에 새로운 토큰을 삽입

## ⚖️ 토큰 링의 장단점

### 장점
- CSMA/CD와 비교하여 장점 보유

### 단점

#### 토큰을 관리해야 함
- 네트워크 안에 오직 하나의 (free)token만 있어야 함
- Free token이 분실되면 ring을 사용할 수 없음

#### Frame 관리 문제
- 일반프레임이 제거되지 않고 네트워크에서 계속 회전하면 Free token이 없는 것과 같음
- **해결책**: Active Monitor Station 지정
  - Monitor bit을 이용하여 frame이 ring을 계속 회전하는 것을 방지
  - Frame이 자신을 거쳐갈 때 M bit을 "1"로 set
  - M bit이 "1"인 frame이 다시 자신을 거쳐가면 제거

#### 기타 단점
- 토큰이 중복되면 네트워크가 제대로 동작하지 않음
- 확장이 (Ethernet에 비해서) 쉽지 않음
- Token Ring 관련 부품이 Ethernet보다 비쌈

## 🆚 이더넷과 토큰 링 비교

### 오버헤드
- 토큰을 유지하는 위해 오버헤드가 많이 들어감
- CSMA/CD보다 토큰 유지에 오버헤드가 많음

### 성능 비교
- **트래픽이 적을 때**: 이더넷과 토큰 링이 성능이 크게 차이 나지 않음
- **트래픽이 많을 때**: 토큰링이 이더넷보다 성능이 더 좋음
  - CSMA/CD는 collision을 해결하는데 많은 시간을 보냄

### 접근 방법 특성
- **Token Ring**: A deterministic access method
  - 주어진 시간 안에 네트워크를 사용할 수 있는 기회가 보장됨

- **CSMA/CD**: A probabilistic access method
  - 사용 전에 노드가 네트워크의 상황을 확인해야 함