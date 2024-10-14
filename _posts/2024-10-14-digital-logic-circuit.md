---
layout: post
title: "Digital logic circuit"
date: 2024-10-14 17:19:11 +0900
categories: 
tags:  [computer-architecture, computer-science, theory]
---

## 논리 게이트

- 디지털 컴퓨터에서는 이진 정보는 물리량인 전압 신호를 이용하여 0과 1로 표현됨
  - (ex) 어떤 컴퓨터에서는 3V신호를 1로, 0.5V 신호를 0으로 나타냄.
- 이진 정보는 게이트(gate) 라고 불리는 논리 회로에서 행해짐.
- 게이트는 입력 논리 조건에 만족할때, 1 또는 0의 신호를 만들어냄.
  - 진리표에 나와있음.

<img src="/post_img/image1014.jpg" width="500px">

## 부울대수

- 이진 변수나 논리 동작을 취급함.
- 변수는 A, B, x, y같이 문자로 표시.
- 세 개의 기본적인 논리 동작으로 AND, OR, 보수가 있다.
   - AND: ∧가 논리기호이고, 점( · )으로 연산 표시, 생략 가능 
   - OR : 덧셈 기호(+)로 표시
   - NOT 연산 : 변수 위에 줄(-)을 그어 표시

<img src="/post_img/image1014-01.jpg" width="500px">

### 보수

> complement

- 기호는  '이다.
- 반대되는 수... 보색도 반대인 색인 것 처럼
- 진법에 따라서 계산법이 다른데, 이진 변수를 A=0일때 보수취하면 A'=1 이런 원리.

### 수식의 보수

- De Morgan 정리를 이용해서 얻어낼 수 있음.
1. 모든 OR 연산은 AND로, 모든 AND연산은 OR로 바꾸어 줌
2. 각 변수를 보수화한다.
> 예시:  <br>
> F = AB + C'D' + B'D <br>
> F' = (A'+B')(C+D)(B+D')

### 맵의 간소화

(추가 예정)