---
layout: post
title: "Digital component"
date: 2024-10-14 17:48:27 +0900
categories: 
tags:  [computer-architecture, computer-science, theory]
---

# 집적회로(Integrated Citcuits) IC

- 디지털 게이트를 구성하는 전자부품을 포함하는 실리콘 반도체(chip)이다 
- Chip안의 많은 게이트들은 회로의 요구에 따라 서로 연결 
- 내부의 게이트와 외부 핀의 연결
- 집적회로의 구분: 밀도(칩속의 게이트수)에따라 구분
  - SSI, MSI, LSI, VLSI

### 소규모 집적회로(Small Scale IC:SSI)

- 10개 이하의 독립적인 게이트가 하나의 칩에 포함 
- 게이트의 입출력이 바로 외부 핀과 연결 

### 중규모 집적회로(Medium Scale IC:MSI) 
- 10개에서 200개까지의 게이트를 집적 
- 디코더(Decoder), 가산기, 레지스터(Register)

### 대규모 집적회로(Large Scale IC:LSI) 

- 200개에서 1000개까지의 게이트를 집적 
- (ex) 프로세서(Processor), 메모리(Memory)

### 초대규모 집적회로(Very Large Scale IC: VLSI) 

- 수천개의 게이트를 하나의 칩에 집적 
- 대형 메모리, 마이크로 컴퓨터(Micro-Computer) 칩

* * *
<br>

# 디지털 논리군(Digital Logic Family) 

- IC를 구현하는 데 적용된 기술에 따라 분류

### TTL(Transister Transister Logic) 

- 가장 많이 사용되고 있는 논리군 
- 고속 TTL, 저전력 TTL, 저전력 쇼트키(Schottky) TTL, 고성능 쇼트키 TTL 
- 전원은 5V, Level은 0V와 3.5V 

### ECL(Emitter Coupled Logic) 

- 게이트의 트랜지스터는 불포화 상태에서 동작 
- 고속도가 요구되는 시스템에 사용 
    - ex) 슈퍼컴퓨터, 신호처리기
- 전달지연 시간(Propagation Delay Time)은 1~2 nano초 
 
### MOS(Metal Oxide Semiconductor) 

- 단상 트랜지스터 사용 
- 대부분 NMOS 

### CMOS(Complementary MOS) 

- NMOS와 CMOS를 연결하여 구성 
- 회로의 밀도가 높고 제조공정 단순 
- 소비전력 적고 경제적이다.

* * *
<br>

# 디코더

- n비트로 코딩된 2진 정보를 최대 2n개의 서로 다른 출력으로 바꾸어 주는 조합회로 
- n개의 입력과 m(m≤2n)개의  출력을 갖는 디코더를 n×m 디코더 또는 n대m 디코더라 한다 

<img src="/post_img/image1014-02.png" width="500px">

### NAND Gate 디코더 

- 보수화된 형태로 출력을 만드는 것이 더 경제적이기 때문에 NAND Gate로 디코더를 구성 

### 2×4 NAND Gate 디코더 

<img src="/post_img/image1014-03.png" width="500px">

> 2×4 NAND Gate 디코더 블럭도

### 디코더 확장 

- 2개 이상의 디코더를 동일한 Enable 입력에 연결하여 하나의 큰 디코더를 구성
  - (ex) 4×16 디코더 4개로 16×64 디코더를 구성

- 2×4 디코더 2개로 3×8 디코더 구성 

<img src="/post_img/image1014-04.png" width="300px">

> 확장 디코더 

* * *
<br>

# 인코더(Encoder) 

- 디코더와 반대되는 동작을 수행하는 회로 
- 2n개의 입력값에 대해 n개의 2진 코드 출력 

<img src="/post_img/image1014-05.png" width="300px">

> 8대2진 인코더

- 부울 대수식
    - 3개의 OR 게이트로 구현함.
    - 2의 n승개의 입력값에 대한 n개의 이진코드를 출력하기 때문에
1. A0=D1+D3+D5+D7 
2. A1=D2+D3+D6+D7 
3. A2=D4+D5+D6+D7 

* * *
<br>

# 멀티플렉서 

- 기능: 멀티플렉서는 데이터 선택에 사용됨.
  - 이와 다르게 플립플롭은 데이터 저장에 사용되므로 헷갈리지말자!

- 동작 : n개의 선택입력에 따라 2n개의 입력 중 하나를 선택하여 출력으로 연결

## 멀티플렉서와 플립플롭의 차이

| 특성 | 멀티플렉서 (MUX) | 플립플롭 |
|------|------------------|----------|
| 주 기능 | 여러 입력 중 하나를 선택하여 출력으로 전달 | 1비트 정보 저장 |
| 회로 유형 | 조합 논리 회로 | 순차 논리 회로 |
| 메모리 기능 | 없음 | 있음 |
| 출력 결정 요소 | 현재 입력과 선택 신호 | 이전 상태와 현재 입력 |
| 클럭 신호 | 불필요 (비동기식) | 필요 (동기식) |
| 상태 유지 | 불가능 | 가능 |
| 용도 | 데이터 선택, 라우팅 | 데이터 저장, 카운터, 레지스터 |

- 4×1멀티플렉서 

<img src="/post_img/image1014-06.png" width="300px">

> 구성 : <그림 2-4> 

- 4개의 입력 데이터가 각각 AND Gate에 입력되고 두개의 선택 입력에 의해 AND Gate의 출력들 중하나를  선택한다 

<img src="/post_img/image1014-07.png" width="300px">

> 4×1멀티플렉서에 대한 함수표 

- Quadruple 2×1 multiplexers

- 4개의 2×1multiplexer로 구성 
- 2개의 4 bit 중 1개의 4 bit를 선택 

<img src="/post_img/image1014-08.png" width="500px">

> Y0는 A0나 B0에 선택적으로 연결됨.

1. 입력: 
A0는 첫 번째 멀티플렉서의 한 입력입니다.<br>
B0는 같은 멀티플렉서의 다른 입력입니다.

2. 출력:

Y0는 첫 번째 멀티플렉서의 출력입니다.

- 1번 멀티플렉서: 입력 A0, B0 → 출력 Y0
- 2번 멀티플렉서: 입력 A1, B1 → 출력 Y1
- 3번 멀티플렉서: 입력 A2, B2 → 출력 Y2
- 4번 멀티플렉서: 입력 A3, B3 → 출력 Y3

3. 선택 과정:

- S(Select) 신호가 A0와 B0 중 어떤 입력을 Y0로 연결할지 결정합니다.
- E(Enable) 신호가 1일 때만 이 선택 과정이 활성화됩니다.

4. 작동 원리:

- E=1, S=0일 때: Y0는 A0의 값을 출력합니다.
- E=1, S=1일 때: Y0는 B0의 값을 출력합니다.
- E=0일 때: Y0는 항상 0을 출력합니다(비활성 상태).

5. 특징:

- 4쌍의 입력 중에서 선택하여 4개의 독립적인 출력을 생성합니다.
- 모든 선택은 동시에 이루어지며, 하나의 제어 신호(S)로 관리됩니다.


## 교수님 ppt 과제

- Chap.2 Problems 3,12,21

### 2-3

인에이블 입력을 가지고 있는 네 개의 3X8 디코더와 하나의 2X4 디코더를 이용하여 5 X 32 디코더를 구성하고 그림 2-3과 같은 블럭도를 그려라

<img src="/post_img/image1014-04.png" width="300px">


> 그림 2-3 

### 2-12

4비트 레지스터의 초기값이 1101이다. 이 레지스터에 직렬 입력 101101을 주고, 오른쪽으로 여섯 번 시프트시킨다. 각 시프트 때마다 레지스터의 내용을 나열해보아라.

### 2-21

4096 X 16 용량의 메모리를 구성하려면 128 X 8 메모리 칩이 몇 개나 필요한가?