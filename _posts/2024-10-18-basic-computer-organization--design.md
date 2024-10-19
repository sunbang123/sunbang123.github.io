---
layout: post
title: "Basic computer organization & design"
date: 2024-10-18 19:27:03 +0900
categories: 
tags:  [computer-architecture, computer-science, theory]
---

# 컴퓨터 구조 종합 공부 노트

## 1. 소프트웨어, 프로그램, 명령어, 마이크로 연산의 관계

- 소프트웨어: 프로그램의 집합
- 프로그램: 명령어의 순서화된 집합
- 명령어: 마이크로 명령어의 순서화된 집합
- 마이크로 명령어: 컴퓨터가 특정 연산을 수행하도록 지시하는 비트 그룹

예시:
소프트웨어 → 워드 프로세서
프로그램 → 문서 저장 기능
명령어 → "파일을 디스크에 쓰기"
마이크로 명령어 → "디스크 섹터 주소 설정", "데이터 버퍼 준비", "디스크 쓰기 신호 전송" 등

## 2. 명령어 형식과 실행 과정 상세 분석

### 2.1 명령어 형식

<img src="/post_img/1018-2/image.png" width="500px">

- 연산 코드(Op-code): 수행할 연산 지정, 피연산자의 주소 지정
  - 예: ADD, SUB, MUL, DIV, LOAD, STORE 등
- 피연산자(Operand): 연산될 데이터
  - 직접 값이나 메모리 주소, 레지스터 번호 등

### 2.2 16비트 명령어 형식 상세 분석

```
|  4비트   |   1비트  |    11비트    |
| Op-code  |  Mode(I) |    Address    |
|  0101    |    0     | 00000001010   |
```

이 예시에서:
- Op-code 0101: "LOAD" 연산
- Mode 0: 직접 주소 지정
- Address 00000001010: 메모리 주소 10 (2진수로 1010)

### 2.3 LOAD 명령어 실행 과정 상세

1. Fetch 단계:
   ```
   T0: AR ← PC (PC의 값을 AR에 복사)
   T1: IR ← M[AR], PC ← PC + 1 (메모리에서 명령어를 IR로 가져오고, PC 증가)
   ```

2. Decode 단계:
   ```
   T2: AR ← IR(0-11), I ← IR(15) (주소 부분을 AR에, 간접 비트를 I에 복사)
   ```

3. Execute 단계:
   ```
   T3: (직접 주소 지정이므로 이 단계 생략)
   T4: DR ← M[AR] (메모리 주소 10의 내용을 DR에 로드)
   T5: AC ← DR, SC ← 0 (DR의 내용을 AC에 복사, 시퀀스 카운터 초기화)
   ```

실제 값 예시:
- PC 초기값: 100
- 메모리 주소 100의 내용: 0101 0 00000001010 (LOAD 10)
- 메모리 주소 10의 내용: 1111000011110000

실행 후:
- AC에는 1111000011110000이 저장됨
- PC는 101이 됨

## 3. 간단한 저장 프로그램 구조

<img src="/post_img/1018-2/image-1.png" width="500px">

- AC (누산기): 레지스터 + 산술 연산 기능
  - 주요 기능: 데이터 저장, 산술 및 논리 연산 수행
  - 예: AC에 저장된 값과 메모리에서 읽은 값을 더하는 연산

## 4. 주소 지정 모드 상세 예시

<img src="/post_img/1018-2/image-3.png" width="500px">

### 4.1 직접 주소 지정 vs 간접 주소 지정

직접 주소 지정 (I = 0):
```
명령어: LOAD 500
실행: AC ← M[500]
```

간접 주소 지정 (I = 1):
```
명령어: LOAD @500
실행: 
1. 임시 ← M[500]
2. AC ← M[임시]
```

예시:
- M[500] = 1000
- M[1000] = 1234567890

결과:
- 직접 주소 지정: AC = M[500] = 1000
- 간접 주소 지정: AC = M[1000] = 1234567890

### 4.2 유효 주소 계산 상세 과정

직접 주소 지정:
1. IR에서 주소 필드 추출: IR(0-11)
2. 유효 주소 = IR(0-11)

간접 주소 지정:
1. IR에서 주소 필드 추출: IR(0-11)
2. 메모리 접근: M[IR(0-11)]
3. 유효 주소 = M[IR(0-11)]

## 5. 레지스터

<img src="/post_img/1018-2/image-4.png" width="500px">

- AC (Accumulator): 16비트, 산술 및 논리 연산 결과 저장
- DR (Data Register): 16비트, 메모리와 데이터 교환
- TR (Temporary Register): 16비트, 임시 데이터 저장
- IR (Instruction Register): 16비트, 현재 실행 중인 명령어 저장
- PC (Program Counter): 12비트, 다음 실행할 명령어의 주소 저장
- AR (Address Register): 12비트, 메모리 주소 지정
- INPR (Input Register): 8비트, 입력 데이터 저장
- OUTR (Output Register): 8비트, 출력 데이터 저장

메모리 유닛: 4K x 16 비트
- 총 4096개의 워드 (2^12 = 4096)
- 각 워드는 16비트

## 6. 명령어 형식 유형

1. 메모리 참조 명령어
   - 예: LOAD, STORE, ADD, SUB
   - 형식: |Op-code|I|Address|

2. 레지스터 참조 명령어
   - 예: CLEAR, INCREMENT, COMPLEMENT
   - 형식: |Op-code|Register specifier|

3. I/O 명령어
   - 예: INPUT, OUTPUT
   - 형식: |Op-code|Device address|

<img src="/post_img/1018-2/image-6.png" width="500px">

## 7. 명령어 세트 (최소 명령어 세트)

<img src="/post_img/1018-2/image-7.png" width="500px">

주요 명령어 설명:
1. AND: AC ← AC AND M[X]
2. ADD: AC ← AC + M[X]
3. LDA: AC ← M[X]
4. STA: M[X] ← AC
5. BUN: PC ← X
6. BSA: M[X] ← PC, PC ← X+1
7. ISZ: M[X] ← M[X]+1, if M[X]=0 then PC ← PC+1

## 8. 제어 장치

<img src="/post_img/1018-2/image-8.png" width="500px">

구성 요소 상세 설명:
- IR (명령어 레지스터): 현재 실행 중인 명령어 저장
- SC (시퀀스 카운터): 명령어 실행 단계 추적
- 디코더: IR의 연산 코드를 해석하여 필요한 제어 신호 생성
- 제어 논리 게이트: 디코더 출력과 타이밍 신호를 조합하여 최종 제어 신호 생성

동작 예시:
1. IR에 "LOAD 1000" 명령어 저장
2. 디코더가 "LOAD" 연산 해석
3. SC가 각 단계 진행 (메모리 주소 설정 → 데이터 읽기 → AC에 저장)
4. 제어 논리 게이트가 각 단계에 필요한 신호 생성

## 9. 명령어 사이클

상세 단계:
1. Fetch: PC의 주소에서 명령어를 IR로 가져옴
2. Decode: IR의 명령어를 해석
3. Effective Address 계산: 간접 주소 지정 시 수행
4. Execute: 명령어 실행
5. Interrupt 체크: 인터럽트 발생 시 처리

타이밍 다이어그램 예시 (Fetch & Decode):
```
T0: AR ← PC
T1: IR ← M[AR], PC ← PC + 1
T2: Decode IR, AR ← IR(Address), I ← IR(I-bit)
T3: If (I == 1) then AR ← M[AR]
T4-T7: Execute instruction
```

## 10. 산술 연산 명령어 실행 과정 상세

### 10.1 ADD 명령어 실행 과정

명령어: ADD 300 (AC에 메모리 주소 300의 내용을 더함)

실행 과정:
1. Fetch & Decode (T0-T2): 일반적인 과정
2. Execute:
   ```
   T3: (직접 주소 지정이므로 생략)
   T4: DR ← M[300] (메모리 300번지 내용을 DR에 로드)
   T5: AC ← AC + DR, E ← Cout (덧셈 수행, 오버플로우 확인)
   ```

예시:
- AC 초기값: 1010 1010 1010 1010
- M[300]: 0101 0101 0101 0101

계산 과정:
```
  1010 1010 1010 1010 (AC)
+ 0101 0101 0101 0101 (DR)
-----------------------
  1111 1111 1111 1111 (결과)
```

결과:
- AC = 1111 1111 1111 1111
- E = 0 (오버플로우 없음)

### 10.2 오버플로우 발생 예시

예시:
- AC 초기값: 1000 0000 0000 0000 (-32768 in 2's complement)
- M[300]: 1000 0000 0000 0000 (-32768 in 2's complement)

계산 과정:
```
  1000 0000 0000 0000 (AC)
+ 1000 0000 0000 0000 (DR)
-----------------------
  0000 0000 0000 0000 (결과, 오버플로우 발생)
```

결과:
- AC = 0000 0000 0000 0000
- E = 1 (오버플로우 발생)

## 11. 분기 명령어 상세 분석

### 11.1 BUN (Branch Unconditionally) 명령어

명령어 형식: BUN 1000

실행 과정:
1. Fetch & Decode (T0-T2): 일반적인 과정
2. Execute:
   ```
   T3: (직접 주소 지정이므로 생략)
   T4: PC ← AR (AR에는 이미 목적지 주소 1000이 저장되어 있음)
   ```

결과: 다음에 실행될 명령어는 메모리 주소 1000에서 가져옴

### 11.2 BSA (Branch and Save Address) 명령어

명령어 형식: BSA 2000

실행 과정:
1. Fetch & Decode (T0-T2): 일반적인 과정
2. Execute:
   ```
   T3: (직접 주소 지정이므로 생략)
   T4: M[AR] ← PC, AR ← AR + 1 
       (현재 PC 값을 메모리 2000에 저장, AR을 2001로 증가)
   T5: PC ← AR (PC를 2001로 설정)
   ```

예시:
- 현재 PC = 1500
- 명령어: BSA 2000

결과:
- M[2000] = 1501 (다음 명령어 주소 저장)
- PC = 2001 (서브루틴의 첫 명령어 주소)

## 12. I/O 구성 상세

<img src="/post_img/1018-2/image-16.png" width="500px">

FGI (Input Flag), FGO (Output Flag) 동작:
- FGI: 
  1. 입력 준비 시 1로 설정
  2. 데이터 읽을 때 0으로 초기화
- FGO:
  1. 출력 준비 시 1로 설정
  2. 데이터 쓸 때 0으로 초기화

### 12.1 I/O 명령어 상세 실행 과정

INP (Input) 명령어:
```
1. AC(0-7) ← INPR (INPR의 8비트를 AC의 하위 8비트로 전송)
2. AC(8-15) ← 0 (AC의 상위 8비트를 0으로 설정)
3. FGI ← 0 (입력 플래그 초기화)
```

OUT (Output) 명령어:
```
1. OUTR ← AC(0-7) (AC의 하위 8비트를 OUTR로 전송)
2. FGO ← 0 (출력 플래그 초기화)
```

I/O 처리 방식:
1. 프로그램 제어 I/O 방식
2. 인터럽트 I/O 방식: IEN (인터럽트 활성화 플립플롭) 사용
3. DMA (Direct Memory Access) 방식

## 13. 인터럽트 처리 상세

### 13.1 인터럽트 사이클

인터럽트 사이클 순서:
```
T0´T1´T2´ (IEN)(FGI+FGO) : R ← 1
RT0 : AR ← 0, TR ← PC
RT1 : M[AR] ← TR, PC ← 0
RT2 : PC ← PC+1, IEN ← 0, R ← 0, SC ← 0
```

### 13.2 인터럽트 처리 상세 예시

시나리오:
1. 프로그램 실행 중 (PC = 5000)
2. I/O 장치에서 인터럽트 발생
3. 현재 명령어 완료 후 인터럽트 사이클 시작

인터럽트 처리 과정:
```
1. R ← 1 (인터럽트 플래그 설정)
2. AR ← 0, TR ← PC (PC 값 5000을 TR에 임시 저장)
3. M[0] ← TR (메모리 주소 0에 복귀 주소 5000 저장)
4. PC ← 1 (인터럽트 서비스 루틴 주소, 가정)
5. 인터럽트 서비스 루틴 실행
6. 루틴 종료 시 M[0]의 값을 PC에 로드하여 원래 프로그램으로 복귀
```

## 14. 제어 유닛 설계

### 14.1 레지스터 및 메모리 제어

예시 (AR 제어):
```
LD(AR) = R´T0 + R´T2 + D7´IT3
CLR(AR) = RT0
INR(AR) = D5T4
```

<img src="/post_img/1018-2/image-26.png" width="500px">


메모리 읽기 연산:
```
Read = R´T1 + D´7I T3 + (D0+D1+D2+D6)T4
```

### 14.2 플립플롭 제어

예시 (IEN 제어):
```
pB7 : IEN ← 1
pB6 : IEN ← 0
RT2 : IEN ← 0
```

<img src="/post_img/1018-2/image-27.png" width="500px">

### 14.3 공통 버스 제어

7개 장치에 대한 인코더 입력 로직 설계:
```
X1 = D4T4 + D5T5 (AR이 버스를 사용할 때)
X7 = R´T1 + D´7IT3 + (D0+D1+D2+D6)T4 (메모리가 버스를 사용할 때)
```

### 14.4 AC 레지스터 제어

```
LD(AC) = (D0+D1+D2)T5 + pB11 + (B9+B7+B6)r
CLR(AC) = rB11
INC(AC) = rB5
```

## 15. 하드웨어 구성요소 요약

- 4096 워드 x 16 비트 메모리 유닛
- 9개 레지스터: AR, PC, DR, AC, IR, TR, OUTR, INPR, SC
- 7개 플립플롭: I, S, E, R, IEN, FGI, FGO
- 2개 디코더: 3x8 연산 디코더, 4x16 타이밍 디코더
- 16비트 공통 버스
- 제어 논리 게이트
- AC 입력에 연결된 가산기 및 논리 회로

## 16. 명령어 세트 완전성

명령어 카테고리:
1. 산술, 논리 및 시프트 연산
2. 메모리와 레지스터 간 정보 이동
3. 프로그램 제어 및 상태 확인 명령어
4. 입출력 명령어

완전성과 효율성:
- 제한된 수의 명령어로 컴퓨터의 상세 논리 설계 가능
- 각 카테고리의 기본 명령어 포함으로 다양한 연산 수행 가능

Chap.5 Problems 3,4,5,9.  submit only 9
Chap.5 Problems 20,21,22,23  submit only 21
Control of common bus x2~x6
Due by next week class
Copied one will be returned without grading
No late homework will be accepted
