---
layout: post
title: "Selection and Iteration Control Statement"
date: 2025-01-27 22:37:07 +0900
categories: 
tags: [Processing, License]
---

# 선택 및 반복 제어문 (출제빈도: 상)

**빈출태그**: `if`, `for`, `while`, 표준 라이브러리

## 1. 선택 제어문

### if-else
기본적인 조건 분기문으로 조건에 따라 코드 실행을 제어합니다.

### 삼항 연산자
```
<조건식> ? <값1> : <값2>
```
조건식이 참이면 값1을, 거짓이면 값2를 반환합니다.

### switch-case-default
- 비교 데이터는 숫자 또는 문자만 가능
- 데이터가 일치하면 해당 영역뿐 아니라 아래의 모든 코드를 수행
- 해당 조건이 없을 때 default가 수행됨
- `break`를 통해 중지지점 설정 가능

## 2. 반복문

### for 문
```
for(<초기식>; <종료분기>; <증감식>) {
    <반복 영역>
}
```
- `continue`: 아래 코드를 무시하고 다음 단계 반복 진행

## 3. 조건 제한 반복문

### while
- 지정한 조건을 만족하는 동안 반복 구역 코드 반복
- 조건에 따라 반복이 안 될 수도 있음

### do-while
- 일단 수행을 먼저 하고 마지막에 조건을 체크
- 최초 1회 반복을 보장

### 무한반복(Loop)
조건식의 결과가 항상 참인 경우 무한반복
- C: `while(1)`
- Java: `while(true)`
- Python: `while True:`

## 4. 함수

### 특징
- 필요할 때 특정 기능을 반복
- 블럭으로 작성(정의)되고 블록 안에서 호출됨
- 호출한 프로그램은 진행을 잠시 멈춤
- 입력, 처리, 출력으로 구현 (Input Process Output)
- 함수는 메인함수 바깥에서 정의됨
- 값에 의한 전달(Call By Value): 인수를 통해 매개변수로 전달된 값은 복사된 값

### 주요 표준 라이브러리
1. **stdio.h** (데이터입출력)
   - `printf()`
   - `scanf()`
   - `getchar()`
   - `putchar()`

2. **math.h** (수학)
   - `sqrt()`
   - `pow()`
   - `abs()`

3. **string.h** (문자열 처리)
   - `strlen()`
   - `strcpy()`
   - `strcmp()`

4. **stdlib.h** (기본 데이터 관련)
   - `atoi()`
   - `atof()`
   - `atol()`
   - `rand()`