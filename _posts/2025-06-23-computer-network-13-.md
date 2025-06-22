---
layout: post
title: "Computer network 13"
date: 2025-06-23 06:32:55 +0900
categories: 
tags: ["Computer Network", "computer-science"]
---

# 13장 네트워크 혼잡 제어 완전 정리

## 13.1 혼잡의 효과

### 혼잡(Congestion)의 정의
- **혼잡**: 네트워크를 통해 전송되는 패킷의 수가 네트워크의 처리 용량에 도달하기 시작하면 발생
- **혼잡 제어(congestion control)의 목적**: Network 안의 packet의 수를 일정한 개수 이하로 유지하여 network의 성능이 급격히 떨어지지 않도록 하는 것

### 혼잡 제어를 하지 않을 경우의 문제점
경험적으로 queue의 길이가 80% 이상 차면:
- queue의 길이는 빠른 속도로 증가
- average packet delay가 무한대로 증가
- 처리양(Throughput)은 "0"으로 떨어진다

### 데이터 네트워크의 특징
- **기본적으로 큐(queue)로 이루어진 네트워크**
- 노드에는 각각의 출력 채널에 대하여 패킷 큐가 있다
- node는 각 link마다:
  - 도착하는 packet을 위한 buffer (input buffer)
  - 출력을 기다리는 packet을 위한 buffer (output buffer)
  - 두 개의 합은 일정하다

### 패킷 처리 과정
1. packet이 도착하면 해당 link의 input buffer에 저장
2. 경로결정을 한 후 해당하는 output buffer로 옮겨짐
3. **버퍼 포화 조건**:
   - input buffer에서 node가 경로결정하는 속도보다 더 빠르게 packet이 도착하거나
   - output buffer에서 packet이 떠나는 속도보다 더 빠르게 packet이 도착하면
   - node의 특정 link의 buffer는 포화될 수 있다

### 혼잡 제어의 두 가지 방법

#### 1) Input packet을 버린다
- Output link에 사용되는 buffer의 수를 제한
- buffer가 차면, 그 output link로 나가야 될 packet을 버린다

#### 2) Flow control을 행사
- node가 이웃 node에 대해 flow control을 행사해서 한 지점에서의 과잉밀집이 network 전체에 퍼지도록 한다
- 노드 6이 노드 5에 대해서 패킷 흐름을 제어하면 노드 6을 향하는 노드 5의 큐에는 패킷이 쌓일 것이다
- 네트워크 상의 한 지점의 혼잡(Congestion)은 전체 네트워크 또는 구역으로 전파될 것이다
- 흐름 제어는 강력한 수단으로서 전체 네트워크의 트래픽을 관리하는 수단으로 사용된다

## 13.1.1 이상적인 성능

### 첫 번째 그래프 (Throughput vs Load)
- 송신자(source end)가 전송한 네트워크 입력 로드(offered load)에 대해서 네트워크를 통하여 목적지(destination end)에 전달된 패킷의 수로서 Steady-state total throughput(정상 상태일 때)
- Maximum theoretical throughput에 대해서 정규화(normalized)했다
- **이론적으로**: Offered load를 네트워크 용량의 최대치만큼 증가시키면 네트워크의 throughput은 증가한다
- Input load를 네트워크 용량의 최대치 이상 올려도 normalized throughput은 "1"로 남아 있다

### 두 번째 그래프 (Delay vs Load)
- **이상적인 경우의 평균적인 패킷의 end-to-end delay**
- Load가 적을 경우: delay는 source에서 destination으로 가는 propagation delay와 노드에서의 processing delay의 합으로 구성
- Load가 증가하는 경우: 노드에서 queueing delay가 추가적으로 더해진다
- **Load가 네트워크 용량을 넘어서면**: 지연(delay)은 무한대로 늘어난다

### 이상적인 경우의 특징
- 버퍼가 infinite 사이즈로 가정해도 normalized throughput은 1.0으로 유지
- 네트워크를 떠나는 패킷의 비율은 "1"이다
- 네트워크로 들어가는 패킷이 "1"보다 크면 내부적인 큐의 크기가 증가
- 정상상태에서 입력이 출력보다 크면 queueing delay는 무한대로 늘어난다

### 세 번째 그래프 (Power)
- **파워(power)**: 지연에 대한 처리량의 비로 정의된다 (ratio of throughput to delay)
- Power = Normalized throughput/Delay

## 13.1.2 실제 성능

### 이상적 성능과의 차이점
그림 13-3은 다음을 고려하지 않았다:
- infinite buffer
- 패킷 전송이나 혼잡제어 같은 오버헤드

실제는:
- 버퍼는 제한되어 있어서 버퍼 오버플로우가 생김
- 혼잡 제어를 위한 제어 패킷이 교환하므로서 네트워크 용량이 낭비됨

### 세 지역으로 분류

#### 1) No congestion (혼잡 없음)
- Load가 가벼울 때
- Offered load가 증가하면 throughput도 따라서 증가한다

#### 2) Moderate Congestion (중간 혼잡)
- Load가 증가하면 moderate congestion에 도달
- **특징**: Throughput 증가하는 속도가 offered load보다 늦다 (이상적인 경우에서 멀어짐)

**그 이유들**:
- load가 네트워크에 골고루 퍼지는 것이 아니다
- 어떤 노드는 moderate congestion을 경험하고 어떤 노드는 severe congestion을 경험하면서 패킷을 버리게 된다
- Load가 증가하면서 네트워크는 패킷을 혼잡이 없는 지역으로 보내서 네트워크의 균형을 잡으려 한다
- 노드 사이에 혼잡지역을 서로 알려주기 위해서 Routing message가 교환이 되면서 overhead가 발생하고, 이 overhead가 데이터 패킷에 사용되는 네트워크 용량(network capacity)을 사용하게 된다

#### 3) Severe Congestion (심각한 혼잡)
- Load를 더 증가시키면 severe congestion에 도달
- **특징**: Load를 증가시키면 Throughput이 오히려 감소한다

**그 이유들**:
- 노드의 버퍼 사이즈가 제한되어 있기 때문
- 노드의 버퍼가 차면 노드는 패킷을 버리기 시작한다
- 소스 노드는 새로운 패킷을 전송하는 도중에 버려진 패킷을 재전송해야 한다
- 이것이 상황을 악화시킨다: 많은 패킷이 재전송될수록 네트워크에 load가 증가하고 버퍼가 포화된다
- 재전송이 성공했다고 할지라도 higher layer에서 (예: Transport layer) ACK(Acknowledgement packet)를 늦게 응답해서 송신자는 재전송이 실패했다고 가정하고 또 다시 재전송을 해야한다
- **결과**: 이 상태에서 시스템은 throughput이 "zero"가 된다

## 13.2 혼잡제어

### 13.2.1 후면 압박(Backpressure)

#### 정의 및 동작
- 후면 압박은 링크나 논리적 연결상태(가상회선)에서 사용한다
- 노드 6이 버퍼가 차서 혼잡하면 노드 6은 노드5나 노드 3에서 오는 패킷을 천천히 오게 하거나 중단시킨다
- 그러면 노드 5나 노드 3도 자신에게 들어오는 트래픽을 줄이거나 정지시킨다
- 이런 흐름이 소스를 향하여 (데이터 트래픽의 흐름을 거슬러서) 역방향으로 전파되며 소스는 네트워크에 새로운 패킷을 보내는 것에 대하여 제약을 받게 된다

#### 후면 압박의 제한점
**유용성이 제한되어 있다**:
- 홉 단위의 흐름 제어가 가능한 연결 위주의 네트워크에서 사용할 수 있으며 X.25 (X dot 25로 읽습니다) 기반의 패킷 교환 네트워크는 이런 방법을 지원한다
- 프레임 릴레이나 ATM 네트워크에서는 홉 단위의 흐름을 제어하는 능력이 없다
- IP를 기반으로 하는 인터넷의 경우에 경로를 따라서 라우터와 라우터 사이에서 데이터 흐름을 규제하는 기능이 없다

### 13.2.2 초크 패킷(Choke Packet)

#### 정의 및 동작
- **초크 패킷(choke packet)**: 트래픽 흐름을 제한하기 위하여 "혼잡한 노드"에서 생성되어 "소스 노드"로 역으로 전송된다

#### 예제: ICMP Source Quench
- **예제**: ICMP(Internet Control Message Protocol)의 소스 제지(Source Quench) 패킷
- 라우터나 목적지 시스템이 ICMP Source Quench packet를 소스로 보낼 수 있고 소스 노드에게 목적지로 보내는 트래픽을 줄이도록 요구한다
- 소스 제지 패킷을 받은 소스는 다음의 소스 제지 패킷을 받을 때까지 트래픽 전송을 줄인다

#### 사용 시점
- 버퍼가 차서 IP 데이터그램을 버려야 하는 라우터나 호스트가 소스 제지 패킷을 사용할 수 있다
- 또한 버퍼가 일정 이상 차오르게 되면 혼잡을 예상하여 소스 제지 패킷을 보낼 수도 있다

### 13.2.3 암시적인 혼잡 제어 신호(Implicit Congestion Signaling)

#### 동작 원리
- 네트워크가 혼잡해지면:
  1. 소스에서 목적지까지 패킷의 전송 시간이 증가
  2. 패킷들이 버려진다
- 소스가 지연시간의 증가와 패킷이 버려지는 것을 알고 흐름을 줄인다면 혼잡은 줄어든다
- **특징**: 암시적인 신호를 바탕으로 한 혼잡제어는 양 종단 시스템의 책임이며 노드는 상관하지 않는다

#### 적용 분야
- 데이터그램 패킷 교환 네트워크나 IP 기반의 인터넷같은 비연결 또는 데이터그램 네트워크에서 효과적이다
- IP 레벨에서는 흐름을 규제하는 논리적 연결이 없다

#### TCP 레벨에서 혼잡 제어
- TCP의 세그멘트를 받았을 때에 송신측에 알려주는 메커니즘
- 지연시간의 증가와 세그멘트의 분실을 감지하는 능력에 근거
- TCP의 소스와 목적지 사이의 데이터 흐름을 규제하는 메커니즘
- 17장에서 다루어진다

### 13.2.4 명시적인 혼잡 제어 (Explicit Congestion Signaling)

#### 기본 개념
- 네트워크의 혼잡이 증가할 때에 그것을 종단 시스템에 경보(alarm)하면 종단 시스템은 네트워크에 대한 부하를 줄이는 방법이다
- 연결 위주(connection oriented)의 네트워크에 적용될 수 있고 각 연결상의 패킷 흐름을 개별적으로 제어하게 된다

#### 명시적 혼잡 시그널링의 두 가지 방법

##### 1) 역방향(Backward)
- 소스에게 통보를 수신한 방향의 반대 방향 트래픽에 대해서 "혼잡 제어"할 것을 통보한다
- **방법**:
  - 소스로 향하는 패킷의 헤더의 특정 비트를 변경하여 표시하거나
  - 소스로 별도의 패킷을 전송하여 통보한다

##### 2) 순방향(Forward)
- 사용자에게 통보를 수신한 방향과 같은 방향 트래픽에 대해서 "혼잡 제어"할 것을 통보한다
- **방법**:
  - 사용자로 향하는 패킷의 헤더의 특정 비트를 변경하여 표시하거나
  - 사용자로 별도의 패킷을 전송하여 통보한다
- **순방향 통보를 받은 종단 시스템의 대응**:
  - 통보를 소스에게 다시 반복하여 전송하거나 (Echo Back)
  - 순방향 통보를 받은 종단 시스템은 소스에게 흐름 제어(Flow Control)를 행사할 수 있다 (TCP 레벨에서의 흐름 제어)

#### 세 가지 분류 방법

##### 1) 이진(Binary)
- 혼잡한 노드가 패킷을 전달(forward)할 때에 혼잡을 나타내는 비트를 설정(set)한다
- 소스가 논리적 연결상에서 "혼잡을 나타내는 비트"가 설정(Set)된 패킷을 받으면 트래픽 흐름을 줄일 수 있다

##### 2) 크레딧 기반(Credit-based)
- **크레딧**: 소스(노드)가 보낼 수 있는 패킷(또는 옥텟)의 양
- 크레딧을 다 사용한 소스는 남은 데이터를 보내기 위해 추가의 크레딧을 받아야 한다

##### 3) 전송률 기반(Rate-based)
- 논리적인 연결에서 소스에게 명시적으로 데이터 전송률에 제한을 준다
- 혼잡이 생기면 논리적 연결상의 임의의 노드가 소스에게 데이터 전송률을 낮추도록 메시지를 보낼 수 있다

## 13.4 패킷 교환 네트워크의 혼잡제어

### 1) Choke packet 사용
- congested node가 모든 또는 일부의 source node로 choke packet을 보낸다
- choke packet을 받은 source node는 choke packet을 받은 이후 일정시간 동안 packet을 보내는 속도를 x% 감소시킨다
- 일정 시간이 지난 후 다시 choke packet을 받지 않으면 원래의 속도로 packet을 보낸다
- choke packet은 source node의 전송 속도를 느리게 하거나 멈추게 해서 network 안의 전체 packet의 수를 제한한다
- **단점**: congestion이 있는 동안 추가의 traffic이 생긴다

### 2) 경로 배정에 의존
- node가 다른 node들에게 link의 지연 정보를 제공해서 routing 결정에 영향을 미칠 수 있다
- 이 정보는 새로운 packet의 생성율에도 영향을 미칠 수 있다
- **사용 예**: ARPA Net에서 사용

### 3) End-to-end probe packet 사용 [Probe packet]
- sender는 packet을 destination node로 전송하는 도중에 불규칙한 간격으로 (예: 50 msec ~150 msec) probe packet을 보낸다
- **Destination에 congestion이 없으면**: ACK를 보내고 source는 packet을 보내는 속도를 증가시킨다
- **Destination에 congestion이 있으면**: probe packet을 무시하고 (ACK를 보내지 않고), source (sender)는 계속 같은 속도를 유지

### 4) 패킷에 혼잡에 관한 정보 추가

#### 역방향 정보 추가
- Congestion의 반대 방향으로(source node 방향으로) 가는 packet에 정보를 추가하는 방법
- **앞에서 배운 '역방향' 명시 혼잡 제어 시그널링**
- **장점**: 제어 정보가 노드에 빨리 도달한다
- **결과**: source node에서 나오는 packet의 흐름을 줄인다

#### 순방향 정보 추가
- Congestion과 같은 방향으로 가는 packet에 "혼잡에 관한 정보"를 추가
- **앞에서 배운 "순방향" 명시 혼잡 제어 시그널링**
- **동작**:
  - destination node가 source node에게 부하 조절을 요청하거나
  - Destination 노드가 소스 노드에 패킷을 보낼 때에 (또는 ACK)를 통해 정보를 소스 노드로 되돌아가게 한다
- **사용 예**: SNA에서 사용