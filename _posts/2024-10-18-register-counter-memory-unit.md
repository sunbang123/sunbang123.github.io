---
layout: post
title: "Register, counter, memory unit"
date: 2024-10-18 19:03:38 +0900
categories: 
tags:  [computer-architecture, computer-science, theory]
---

## 1. n-비트 레지스터

- 정의: n개의 플립플롭과 데이터 처리용 조합회로로 구성
- 기능: n비트의 2진 정보 저장
- 예: 4비트 레지스터

<img src="/post_img/image1014_edit-01.png" width="500px">

### 특징
- 공통 clock 입력으로 동시 동작
- Clear 입력 (0) → 출력을 0으로 초기화
- Clock 차단 → 레지스터 내용 유지

## 2. 병렬 로드 레지스터

<img src="/post_img/image1014_edit-02.png" width="500px">

- 주 클럭펄스 발생기 사용
- Load 제어입력으로 클럭펄스 작용 결정
  - Load = 1: 클럭 상승 시 데이터 로드
  - Load = 0: 레지스터 내용 유지

## 3. 시프트 레지스터

<img src="/post_img/image1014_edit-03.png" width="500px">

- 기능: 2진 정보를 단/양방향으로 이동
- 구조: 플립플롭 간 연쇄적 연결
- 동작: 클럭 펄스에 의해 1비트씩 이동

### 병렬 로드 양방향 시프트 레지스터

<img src="/post_img/image1014_edit-04.png" width="500px">

- 구성: 4 D-FF + 4x1 MUX
- 기능:
  1. 클럭펄스 입력
  2. 우측/좌측 시프트
  3. 병렬 로드/출력
  4. 정보 유지 기능

<img src="/post_img/image1014_edit-05.png" width="500px">

### 응용

<img src="/post_img/image1014_edit-06.png" width="500px">

- 주요 용도: 원격 시스템 간 데이터 전송

## 4. 카운터

- 정의: 입력펄스에 따라 정해진 순서로 상태 변이
- 용도: 사건 발생 횟수 계수, 타이밍 신호 생성
- 종류: Up-Counter, Down-Counter
- 계수 범위: n비트 → 0 ~ (2^n - 1)

### 동기식 카운터
<img src="/post_img/image1014_edit-07.png" width="500px">

- 특징: 모든 플립플롭에 공통 클럭 연결

### 비동기식 카운터
- 특징: 첫 플립플롭의 출력이 다음 플립플롭의 클럭으로 연결

### 병렬 로드 2진 카운터
<img src="/post_img/image1014_edit-08.png" width="500px">

- 기능: 초기값 설정 가능
- 동작 모드:
  1. Clear (1) → 모든 비트 0으로 초기화
  2. Load (1) → 병렬 입력 로드
  3. Increment (1) → 오름차순 계수

<img src="/post_img/image1014_edit-09.png" width="500px">

## 5. 메모리 장치

- 정의: 정보 입출력 기능을 가진 저장요소 집합
- 단위: Word (비트 그룹), Byte (8비트)
- 구조: 워드 수와 비트 수로 규정
- 주소 지정: 0 ~ 2^k - 1 (k: 주소 비트 수)

### 용량 단위
- 1K = 2^10 Byte
- 1M = 2^20 Byte
- 1G = 2^30 Byte

### RAM (Random Access Memory)
<img src="/post_img/image1014_edit-10.png" width="500px">

- 특징: 모든 워드에 동일한 접근 시간
- 구성: 데이터 라인, 주소 라인, 제어 라인
- 동작:
  - 쓰기: 주소 지정 → 데이터 입력 → Write 활성화
  - 읽기: 주소 지정 → Read 활성화

### ROM (Read Only Memory)
<img src="/post_img/image1014_edit-11.png" width="500px">

- 특징: 내용 변경 불가, 읽기만 가능
- 규격: m x n ROM (m: 워드 수, n: 비트 수)
- 구성: 디코더 + OR 게이트
- 종류:
  1. 고정 프로그램 ROM
  2. PROM (Programmable ROM)
  3. EPROM (Erasable PROM)
  4. EEPROM (Electrically EPROM)


Chap.2 Problems 3,12,21. submit only 3
Due by next week class
Copied one will be returned without grading
No late homework will be accepted
