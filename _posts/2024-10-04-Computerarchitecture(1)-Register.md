---
layout: post
title: "Computer architecture(1) - Digital Computer"
date: 2024-10-04 19:38:57 +0900
categories: 
tags: 
---

# 디지털 컴퓨터의 구조

<img src="/post_img/image1004-1.png" width="500px">

> 컴퓨터 하드웨어는 세 가지 부분으로 나뉜다.

### CPU (Central Processing Unit)

중앙처리장치CPU의 기능을 소개하겠다.

1. 데이터를 조작하는 산술-논리 연산 부분
  - > Arithmetic and logic unit for manipulating data

2. 데이터를 저장하는 여러 개의 레지스터
  - > Registers for storing data

3. 명령어를 가져와 수행하는 제어회로
  - > Control circuits for fetching & executing instructions


### RAM (Random Access Memory)

주기억 장치이자, 임의접근 기억장치 RAM을 설명하겠다.

CPU가 명령어와 데이터를 저장하는데, 이진 정보를 입력하거나 가져올 때 RAM을 거쳐가야한다.

저장된 위치에 관계없이 모든 데이터에 동일한 속도로 접근하기 때문에 언제나 일정한 시간이 소요된다. (임의접근 기억장치기능)

CPU의 모든 정보가 RAM을 거치는 것은 아니지만 CPU와 저장 장치 사이의 주요 중간 저장소 역할을 한다. 

RAM은 컴퓨터의 주기억장치로 CPU가 빠르게 데이터를 읽고 쓸 수 있어 컴퓨터의 전반적인 성능에 영향을 준다. 

> Storage for instructions and data

### IOP (Input and Output Processor)

컴퓨터와 외부세계와의 통신과 데이터 전송을 제어함.

> Communicating and controlling the transfer of information b/w the computer and the outside world

종류: 키보드, 프린터, 터미널, 자기 디스크장치

> Keyboards, printers, terminals, magnetic disk devices

# 16Bit CPU

- CPU : 중앙 처리 장치
    - central processing unit, central/main processor
    - 컴퓨터 시스템을 통제하고 프로그램의 연산을 실행 · 처리하는 가장 핵심적인 컴퓨터의 제어 장치, 혹은 그 기능을 내장한 칩

- 16비트는 또한 중앙 처리 장치의 버스(BUS)가 16비트 단위로 자료를 전송하는 컴퓨터 세대를 가리키기도 하며 이를 16비트 컴퓨터라고도 부른다. 한마디로 구세대 컴퓨터.
- 16비트 프로세서 (ex) 인텔 8088

* * *

# 32Bit 64Bit Computer

- 32비트와 64비트 차이점: 메모리를 처리하는 방식
- 비트 사이즈: 처리 할 수 있는 메모리
    - (ex) 1GB = 1024 * 1024 * 1024 = 1073741824 byte
- 32비트 컴퓨터
    - 2^32 = 4,294,967,296 byte = 4GB
- 64비트 컴퓨터
    - 2^64 = 16EB
    - 이만큼 많은 양의 메모리를 사용할 필요는 없다.
    - RAM에 로드해야함.

### RAM

- 32 비트

    - 컴퓨터에서 프로그램이나 데이터를 실행하거나 먼저 RAM에 로드해야함.
    - 데이터가 RAM에서 CPU로 이동하는 과정에서 4GB밖에 되지 않는 낮은 메모리를 보안하기 위해서 일부를 느린 하드드라이브에 저장해야함. 추가작업이 이뤄지면서 컴퓨터 속도가 느려지는것임.

- 64 비트
    - 빠른 RAM에 저장한 다음 느린 하드드라이브에 저장할 뿐만 아니라, 더 많은 데이터를 RAM에 저장할 수 있어서 훨씬 더 빠름.
    - 더 많은 데이터가 RAM에 저장될 수 있음

## reference

- https://www.youtube.com/watch?v=Wu2A4fpFzgs

- https://ko.wikipedia.org/wiki/16%EB%B9%84%ED%8A%B8

- https://ko.wikipedia.org/wiki/%EC%A4%91%EC%95%99_%EC%B2%98%EB%A6%AC_%EC%9E%A5%EC%B9%98