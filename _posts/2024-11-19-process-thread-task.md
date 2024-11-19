---
layout: post
title: "Process thread task"
date: 2024-11-19 18:07:28 +0900
categories: Process
tags: 
---

# 메모리 관리, Memory Architecture

1. 운영체제 OS

- 사용자와 컴퓨터 하드웨어 간의 인터페이스를 제공함.

2. 물리 메모리

- 컴퓨터에 장착된 RAM(Random Access Memory)
- 임의 위치에서 동일한 시간에 빠르게 접근한다.
- 현재 실행중인 프로그램과 데이터 저장에 용이함.

3. 가상 메모리

- RAM의 부족을 해결하기 위해 OS에 의해 RAM처럼 사용가능한 메모리.
- 사용하지 않는 메모리는 Pasing되어 가상 메모리로 이동함.

4. 가상 메모리 주소공간

- 하나의 프로세스가 독립적으로 가지는 최대 메모리 주소 공간
- 32bit 프로세스: 4GB, 64bit 프로세스: 16E
- 코드 영역, 데이터 영역, 힙, 스택
- 코드 영역: 기계어 코드가 위치함.
- 데이터 영역: 전역 변수와 정적 변수가 위치함.
- 힙(Heap): 동적 메모리 할당을 위해 사용됨
- 스택(Stack): 지역변수와 함수 호출 정보를 저장함.

5. Commit 영역

6. Reserve 영역

7. Free 영역

8. Pasing 메모리

# C# (.NET) 타입

| 타입 구분  | 내장 타입                  | 정의 타입                  |
|------------|----------------------------|----------------------------|
| **값 타입** | `char`, `int`, `long`, `float`, `double` ... | `enum`, `struct`           |
| **참조 타입** | `object`, `string`          | `class`, `delegate`, `interface` |

# struct 값 타입의 데이터 구조

<img src="/post_img/1119/image1.png" width="500px">

> 사용자 지정 struct 구조체와, int형식은 값타입이다.

# class 참조 타입의 데이터구조

<img src="/post_img/1119/image2.png" width="500px">

> class는 new 연산자를 통해 생성되고, 참조변수가 포인터 역할을 한다.

# Blocking

# Non-blocking