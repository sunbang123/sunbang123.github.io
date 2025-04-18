---
layout: post
title: "Data representation"
date: 2024-10-18 19:12:41 +0900
categories: 
tags:  [computer-architecture, computer-science, theory]
---

## 1. 데이터 유형
- 디지털 컴퓨터의 이진 정보는 메모리나 프로세서 레지스터에 저장됨
- 주요 유형:
  1. 산술 연산용 숫자
  2. 데이터 처리용 알파벳
  3. 특정 목적의 기타 이산 기호

## 2. 수 체계

### 2.1 진법 변환
- 10진수: (724.5)₁₀ = 7×10² + 2×10¹ + 4×10⁰ + 5×10⁻¹
- 2진수: (101101)₂ = 1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = (45)₁₀
- 8진수: (736.4)₈ = 7×8² + 3×8¹ + 6×8⁰ + 4×8⁻¹ = (478.5)₁₀
- 16진수: (F3)₁₆ = 15×16¹ + 3×16⁰ = (243)₁₀

### 2.2 진법 간 변환
1. 2진수 ↔ 8진수:
   - (10110001101011.111100000110)₂ = (?)₈
   - 3비트씩 그룹화: (010.110 001.101 011.111 100.000 110)₂
   - 변환 결과: (26.1337406)₈

2. 2진수 ↔ 16진수:
   - (10110001101011.11110010)₂ = (?)₁₆
   - 4비트씩 그룹화: (1011.0001 1010.1111 1001.0)₂
   - 변환 결과: (B.1AF9)₁₆

3. 8진수 ↔ 2진수:
   - (673.124)₈ = (?)₂
   - 각 자리를 3비트 2진수로 변환: (110 111 011 . 001 010 100)₂
   - 변환 결과: (110111011.001010100)₂

4. 16진수 ↔ 2진수:
   - (306.D)₁₆ = (?)₂
   - 각 자리를 4비트 2진수로 변환: (0011 0000 0110 . 1101)₂
   - 변환 결과: (1100000110.1101)₂

### 2.3 10진수를 2진수로 변환
- 예: (724.5)₁₀ = (1011010100.1)₂
  - 정수부: 724 ÷ 2 = 362 나머지 0, 362 ÷ 2 = 181 나머지 0, ...
  - 소수부: 0.5 × 2 = 1.0 (정수부 1)
- 예: (41)₁₀ = (101001)₂
  - 41 ÷ 2 = 20 나머지 1, 20 ÷ 2 = 10 나머지 0, ...
- 예: (0.6875)₁₀ = (0.1011)₂
  - 0.6875 × 2 = 1.3750 (정수부 1), 0.3750 × 2 = 0.7500 (정수부 0), ...

## 3. 코드화된 수 체계

### 3.1 이진화된 8진수
- 표 3-1 참조
- 예: (1 010 111 101 100 011)₂ = (127543)₈
  - 각 3비트 그룹을 8진수 한 자리로 변환

### 3.2 이진화된 16진수
- 표 3-2 참조
- 예: (1010 1111 0110 0011)₂ = (AF63)₁₆
  - 각 4비트 그룹을 16진수 한 자리로 변환

<img src="/post_img/1018/image.png" width="500px">

### 3.3 이진화된 10진수 (BCD)
- 4비트 조합으로 10진 숫자 하나를 표현
- 표 3-3 참조
- 예: (10010011)BCD = (93)₁₀
  - 1001 = 9, 0011 = 3

<img src="/post_img/1018/image-1.png" width="500px">

## 4. 문자 표현

### 4.1 영숫자 표현
- ASCII (American Standard Code for Information Interchange)
  - 7비트 코드, 8번째 비트는 패리티용
  - 128개 문자 포함 (2⁷ = 128)
  - 표 3-4 참조
- 예: 'A' = 1000001 (ASCII)
- ASCII를 BCD로 변환: 상위 011 비트 제거

## 5. 보수

### 5.1 r의 보수
- 정의: r진법의 n자리 수 N에 대해, r의 보수는 r^n - N (N ≠ 0일 때)
- 10의 보수: 10진수에서 사용
- 2의 보수: 2진수에서 사용

### 5.2 (r-1)의 보수
- 정의: r진법의 n자리 수 N에 대해, (r-1)의 보수는 (r^n - 1) - N
- 9의 보수: 10진수에서 사용
- 1의 보수: 2진수에서 사용

### 5.3 보수 계산 방법
- 9의 보수: 각 자리 숫자를 9에서 뺌
  - 예: 546700의 9의 보수 = 999999 - 546700 = 453299
- 1의 보수: 각 비트를 반전
  - 예: 1011001의 1의 보수 = 0100110
- 2의 보수: 1의 보수에 1을 더함
  - 예: 1011001의 2의 보수 = 0100110 + 1 = 0100111
- 단축법: 오른쪽부터 첫 1까지 그대로 쓰고, 나머지 비트 반전

### 5.4 보수를 이용한 뺄셈
- A - B = A + B'(10의 보수)
- 예: 72532 - 13250 = 72532 + 86750 = 159282
  - 끝자리 올림(End Carry) 100000 버림
  - 결과: 59282
- 음수 결과 처리:
  - 끝자리 올림이 없으면 결과를 다시 보수로 취하고 음수 부호를 붙임
  - 예: 13250 - 72532 = 13250 + 27468 = 40718
    - 40718의 10의 보수: 59282
    - 최종 결과: -59282

## 6. 컴퓨터에서의 수 표현

### 6.1 부호 비트
- 가장 왼쪽 비트를 부호 비트로 사용
- 0: 양수, 1: 음수

### 6.2 고정 소수점
- 소수점 위치가 항상 동일
- 분수 표현: 소수점을 레지스터 맨 왼쪽에 둠
- 정수 표현: 소수점을 레지스터 맨 오른쪽에 둠

### 6.3 부동 소수점
- 소수점 위치가 가변적
- 첫 번째 레지스터: 10진 소수점 위치
- 두 번째 레지스터: 숫자 값

### 6.4 음수 표현 방식
1. 부호-크기 표현
   - 예: -14 (8비트) = 1 0001110
2. 부호화된 1의 보수 표현
   - 예: -14 (8비트) = 1 1110001
3. 부호화된 2의 보수 표현
   - 예: -14 (8비트) = 1 1110010

<img src="/post_img/1018/image-2.png" width="500px">

## 7. 산술 연산

### 7.1 덧셈
- 2의 보수 표현에서는 부호 비트를 포함하여 더함
- 부호 비트의 올림은 무시
- 예:
  (+6) 00000110
  (-6) 11111010
  합:  00000000

### 7.2 뺄셈
- 감수의 2의 보수를 취한 후 덧셈 수행
- 예: (-6) - (-13) = (-6) + (+13)
  11111010 (2의 보수 표현 -6)
  00001101 (+13)
  합: 100000111 (끝자리 올림 무시)
  결과: 00000111 (+7)

### 7.3 오버플로우
- n자리 두 수의 합이 n+1자리가 될 때 발생
- 부호 있는 수에서는 마지막 두 올림(Carry In, Carry Out)을 XOR하여 검사
- 예: 8비트 레지스터에서 70 + 80
  01000110 (+70)
  01010000 (+80)
  10010110 (결과, 오버플로우 발생)
  Carries: 01 (XOR 결과 1, 오버플로우 발생)

## 8. 부동 소수점 표현

### 8.1 구성
- 가수(Mantissa)와 지수(Exponent)로 구성
- m × r^e 형태 (m: 가수, e: 지수, r: 기수)
- 예: +6132.789 표현
  - 가수: +0.6132789
  - 지수: +04

### 8.2 정규화
- 가수의 가장 왼쪽 숫자가 0이 아니도록 조정
- 예: 2진수 +1001.11
  - 8비트 가수, 6비트 지수로 표현
  - 정규화: 01001110 (가수), 000100 (지수)

### 8.3 부동 소수점 연산
- 일반 고정 소수점 연산보다 복잡하고 시간이 오래 걸림
- 과학 계산에 필수적

## 9. 기타 코드

### 9.1 그레이 코드
- 연속된 숫자 간 1비트만 변경
- 제어 연산에 사용 가능
- 표 3-5 참조

<img src="/post_img/1018/image-3.png" width="500px">

### 9.2 기타 10진 코드
- 10진 숫자 표현에 최소 4비트 필요
- 표 3-6 참조
- 예: 2421 코드, 5421 코드, Excess-3 코드

<img src="/post_img/1018/image-4.png" width="500px">

## 10. 오류 검출

### 10.1 패리티 비트
- 가장 일반적인 오류 검출 코드
- 홀수 패리티 예시: 그림 3-3
- 패리티 비트 생성: 표 3-7
- 예: 데이터 1011 → 패리티 비트 1 → 전송 11011

<img src="/post_img/1018/image-5.png" width="500px">

- 패리티 비트는 전송되는 데이터 비트들에 추가로 붙는 비트로, 보통 짝수 패리티나 홀수 패리티 방식이 있습니다.
- 예를 들어, 짝수 패리티의 경우 전송되는 데이터의 비트 합이 짝수가 되도록 패리티 비트를 설정합니다.
- 이를 통해 데이터가 전송되는 과정에서 오류가 발생했는지 간단히 확인할 수 있습니다.