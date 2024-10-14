---
layout: post
title: "Register_Transfer"
date: 2024-10-14 16:10:47 +0900
categories: 
tags:  [computer-architecture, computer-science, theory]
---

# Register transfer

### 한학기동안 배울것

- 레지스터 종류와 쓰임 (하드웨어)
- 시퀀스 (소프트웨어)
- 컨트롤 (컨트롤)

### Block Diagram of Register

<img src="/post_img/image1006.png" width="500px">

- AR (Address Register)
- DR(Data Register) or BR(Buffer Register)
- IR(Instruction Register)
- PC(Program Counter)
- R0 ~ R15  or  A ~ H.


### RTL, Basic symbols for register transfer

- Register-transfer level
    - 하드웨어 레지스터 간의 디지털 신호 흐름과 해당 신호에 대해 수행되는 논리 연산 측면에서 동기식 디지털 회로를 모델링하는 설계 추상화입니다.

- Symbol: Microoperation을 활용한 데이터의 이동을 나타냄.
    - (ex) A <- B
    - B라는 레지스터에서 A레지스터로 데이터를 옮겨라!
    - ',' : at the same time 동시에 시행하라.
    - [ ]  : 지정된 메모리의 주소
    - (ex) DR <- M[AR]
    - 메모리 안의 AR이라는 주소에 있는 데이터를 DR에 옮긴다.
    - P : R2 <- R1
    - P 조건을 만족하면! Control한다는 뜻.
    - If (P=1) then R2 <- R1
    - T가 1일때 R1과 R2를 스와핑하라!

### BUS

- A set of common lines
- Bus types: 
    - Address bus 
    - Data bus 
    - Control bus

> 버스 예시 그림 (책 참고: Computer System Architecture - Morris Mano)

<img src="/post_img/image1006-1.png" width="500px">

#### DR <- AC, AC <- DR 이때 버스는 누가 잡을까?

- Bypass라고, DR에서 AC로 이어지는 라인 때문에 동시상황일때 AC가 버스를 잡아야함.