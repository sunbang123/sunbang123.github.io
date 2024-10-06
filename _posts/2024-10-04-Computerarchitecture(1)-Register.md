---
layout: post
title: "Computer architecture(1) - Register"
date: 2024-10-04 19:38:57 +0900
categories: 
tags: 
---

# 디지털 컴퓨터의 구조

<img src="/post_img/image1004-1.png" width="500px">

CPU (Central Processing Unit)
Arithmetic and logic unit for manipulating data
Registers for storing data
Control circuits for fetching & executing instructions

RAM (Random Access Memory)
Storage for instructions and data

IOP (Input and Output Processor)
Communicating and controlling the transfer of information b/w the computer and the outside world
Keyboards, printers, terminals, magnetic disk devices

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

# 레지스터 메모리

레지스터 메모리는 컴퓨터에서 가장 작고 빠른 메모리입니다. 메인 메모리의 일부가 아니며 CPU에서 가장 작은 데이터 보유 요소인 레지스터 형태로 위치합니다. 레지스터는 CPU에서 자주 사용하는 데이터, 명령어 및 메모리 주소를 일시적으로 보유합니다. 레지스터는 현재 CPU에서 처리 중인 명령어를 보유합니다. 모든 데이터는 처리되기 전에 레지스터를 통과해야 합니다. 레지스터는 사용자가 입력한 데이터를 처리하는데 사용됩니다.

레지스터에는 약 32비트에서 64비트의 소량의 데이터가 저장됩니다. CPU 속도는 CPU에 내장된 레지스터의 수와 크기(비트 수)에 따라 달라집니다. 레지스터는 용도에 따라 다양한 유형이 있습니다.

# 레지스터 메모리의 구조

<img src="/post_img/image1004.png" width="500px">

이 아키텍처(구조)는 레지스터와 메모리에서 연산을 수행하는 명령어에 의해 구동됩니다. 모든 피연산자가 레지스터에 포함되어 있는 경우 이 아키텍처를 레지스터 플러스 아키텍처라고 합니다. 연산에는 두 개의 피연산자가 있을 수 있는데, 그 중 하나는 메모리에 있고 다른 하나는 레지스터에 있을 수 있습니다. 반면에 두 연산의 피연산자는 레지스터에 있거나 메모리에 있으므로 다른 아키텍처와 구별됩니다.

### 메모리 등록

CPU의 레지스터 수는 적고 크기도 작습니다. 레지스터의 크기는 64비트 미만입니다. 디스크 메모리 및 기본 메모리에 비해 빠릅니다. 범용 레지스터의 크기는 단어 크기에 영향을 미칩니다.

# 컴퓨터 레지스터의 종류

### DR (Data Register)

- 프로세서에서 작동하는 피연산자(변수)를 저장하는데 사용됩니다. 
- 주변 장치로 전송되거나 수신되는 데이터를 일시적으로 저장합니다. 
- 데이터를 임시로 저장하고 메모리에서 읽은 데이터를 저장하거나 연산 결과를 일시적으로 보관합니다.

### PC (Program Counter)

- 현재 명령이 완료된 후 가져올(fetch) 다음 명령어의 메모리 위치 주소를 보유합니다.
- 서로 다른 프로그램의 실행 경로를 유지하는 데 사용되므로 이전 명령어가 완료되면 프로그램을 하나씩(one by one) 실행합니다.
- 다음에 실행될 명령어의 주소를 가리키고 프로그램 실행 흐름을 제어하는 역할을 합니다.
- 명령어가 실행될 때마다 PC는 자동으로 증가하여 다음 명령어를 가리킵니다.

### IR (Instruction Register)

- 메인 메모리에서 가져온 명령어를 저장합니다.
- 실행할 명령어 코드를 보관하는 데 사용됩니다.
- 제어 장치는 Instruction Register에서 명령어를 가져온 다음 이를 해독(Decode)하여 실행(execute)합니다.
- 현재 실행 중인 명령어를 저장하는 레지스터입니다.
- CPU가 메모리에서 명령어를 가져오면, 이 명령어는 IR에 저장되고 해석됩니다.

### Accumulator Register

- 누산기 레지스터.
- 시스템에서 생성된 결과를 저장하는 데 사용됩니다.
- 예를 들어, 처리 후 CPU에서 생성된 결과는 AC 레지스터에 저장됩니다.

### AR (Address Register)

- 명령어 또는 데이터가 메모리에 저장되는 메모리 위치의 주소를 저장합니다.
- 메모리 주소를 저장하는 레지스터입니다.
- 명령어나 데이터의 위치를 가리키며, 메모리에서 데이터를 읽거나 쓰는 과정에서 사용됩니다.

### I/O Address Register
- I/O 주소 레지스터.
- 특정 I/O 장치의 주소를 지정하는 것이 업무입니다.

### I/O Buffer Register
- I/O 버퍼 레지스터.
- I/O 모듈과 CPU 간에 데이터를 교환하는 것이 업무입니다.

> 이 레지스터들은 CPU 내부에서 명령어를 가져오고, 해석하고, 실행하는 과정에서 핵심적인 역할을 합니다.

* * *

# 교육용 모델 (with. Computer System Architecture - Morris Mano)

현재 대학 수업때 배우는 책인 Computer System Architecture(저자 Morris Mano) 에서는 16bit 컴퓨터이면서 2^12 = 4096개의 메모리 위치를 나타내는 교육용 모델을 사용해서 컴퓨터를 디자인한다. 다음 포스팅에서 교육용 모델을 통해 배운 내용을 작성해볼 예정이다.


### 참고 정보

#### DR (Data Register)

- 16 비트 레지스터

#### IR (Instruction Register)

- 16 비트 레지스터

#### Accumulator Register
- 16비트 레지스터

#### AR (Address Register)

- 12비트 레지스터

#### PC (Program Counter)

- 12비트 레지스터. 프로그램 명령이 끝난 후 실행할 다음 주소를 나타내기 때문에 Adress Regist와 크기가 같다.

* * *

# Reference

- https://www.javatpoint.com/register-memory

- https://www.ibm.com/docs/en/hla-and-tf/1.6?topic=set-register-initialization

- https://www.youtube.com/watch?v=Wu2A4fpFzgs

- https://ko.wikipedia.org/wiki/16%EB%B9%84%ED%8A%B8

- https://ko.wikipedia.org/wiki/%EC%A4%91%EC%95%99_%EC%B2%98%EB%A6%AC_%EC%9E%A5%EC%B9%98