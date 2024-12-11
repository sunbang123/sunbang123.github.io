---
layout: post
title: "Mano machine concepts"
date: 2024-12-11 16:14:03 +0900
categories: 
tags: 
---

# Mano Machine 주요 개념 정리

## 마이크로 연산 제어 신호

### FGO (Full Gate Operate)
AC(Accumulator)의 값을 확인하는 조건부 분기 연산입니다:
- AC가 0이 아닐 경우: 다음 마이크로명령어로 진행
- AC가 0일 경우: NextU+2 위치의 마이크로명령어로 건너뜁니다

### S (Subtract)
AC에서 M[AR]의 값을 빼는 마이크로 연산으로, 결과는 AC에 저장됩니다. 2의 보수 연산을 사용하여 구현됩니다.

## 제어 신호

### NextU (Next μ-instruction)
다음 마이크로 명령어로 진행하는 제어 신호입니다. Control Address Register(CAR)의 값을 1 증가시켜 다음 마이크로 명령어 주소로 이동합니다.

### Next ins (Next instruction)
현재 명령어의 실행을 완료하고 다음 기계어 명령어로 진행하는 제어 신호입니다. Program Counter(PC)를 1 증가시키고 새로운 명령어 사이클을 시작합니다.

## 하드웨어 구성 요소

### SC (Sequence Counter)
마이크로프로그램 명령어의 순서를 제어하는 3비트 카운터입니다:
- 명령어 사이클 시작 시 0으로 초기화
- T0부터 T7까지의 타이밍 신호 생성
- 클럭 펄스마다 1씩 증가하며 마이크로연산의 타이밍 제어

### C (Carry flip-flop)
뺄셈 연산 시 2의 보수 계산을 위해 사용되는 플립플롭입니다:
- 뺄셈 시작 시: C = 1 (Set)
- 뺄셈 종료 시: C = 0 (Clear)

## Executed Micro Operations
CPU가 실제로 실행하는 기본적인 동작들을 의미합니다. 예를 들어 ADD 명령어 실행 시 다음과 같은 마이크로 연산들이 순차적으로 실행됩니다:

1. T0: AR ← PC (주소 레지스터에 프로그램 카운터 값 저장)
2. T1: IR ← M[AR], PC ← PC + 1 (명령어 가져오기 및 PC 증가)
3. T2: AR ← IR(0-11) (오퍼랜드 주소 가져오기)
4. T3: DR ← M[AR] (데이터 가져오기)
5. T4: AC ← AC + DR (실제 덧셈 수행)