---
layout: post
title: "Discrete fourier"
date: 2024-12-09 14:42:39 +0900
categories: 
tags: [MATLAB, Digital Image Processing]
---

# 푸리에 변환의 핵심 수식

## 1. 기본 푸리에 변환

### 1.1 1차원 푸리에 변환
신호 x(t)를 주파수 영역으로 변환:

F(ω) = ∫ x(t) • e^(-iωt) dt

여기서:
- F(ω): 주파수 영역에서의 신호
- x(t): 시간 영역에서의 신호
- ω: 각주파수 (2πf)
- i: 허수 단위 (i² = -1)

### 1.2 이산 푸리에 변환 (DFT)
디지털 신호의 변환:

F[k] = Σ x[n] • e^(-i2πkn/N)

역변환:
x[n] = (1/N) • Σ F[k] • e^(i2πkn/N)

## 2. 2차원 푸리에 변환

### 2.1 이미지 처리용 기본 수식
F(u,v) = Σ Σ f(x,y) • e^(-i2π(ux/M + vy/N))

역변환:
f(x,y) = (1/MN) • Σ Σ F(u,v) • e^(i2π(ux/M + vy/N))

### 2.2 복소수 형태
F(u,v) = R(u,v) + i•I(u,v)
- R(u,v): 실수부
- I(u,v): 허수부

## 3. 실용적인 수식들

### 3.1 오일러 공식 활용
e^(-iθ) = cos(θ) - i•sin(θ)

따라서 DFT는 다음과 같이 표현 가능:
F[k] = Σ x[n] • (cos(2πkn/N) - i•sin(2πkn/N))

### 3.2 진폭과 위상
진폭 스펙트럼:
|F(u,v)| = √(R² + I²)

위상 스펙트럼:
φ(u,v) = tan⁻¹(I/R)

## 4. 게임 개발 응용

### 4.1 주파수 도메인 필터링
H(u,v) = F(u,v) × G(u,v)
- F(u,v): 입력 이미지의 푸리에 변환
- G(u,v): 필터 함수
- H(u,v): 필터링된 결과

### 4.2 가우시안 블러
G(u,v) = e^(-(u² + v²)/(2σ²))

### 4.3 모션 블러
H(u,v) = sinc(πT(uu₀ + vv₀)) • e^(-iπT(uu₀ + vv₀))

## 5. 최적화 기법

### 5.1 대칭성
F(-u,-v) = F*(u,v)
- F*: 복소 켤레 (a - i•b)

### 5.2 분리 가능한 변환
2D DFT = (1D DFT on rows) × (1D DFT on columns)

### 5.3 고속 푸리에 변환 (FFT)
N-포인트 FFT 복잡도:
- 연산 수 = N•log₂(N)
- 메모리 = 2N (실수부 + 허수부)

## 6. 실시간 근사

### 6.1 블룸 효과
I_bloom = I + α•Blur(max(I - threshold, 0))

### 6.2 간단한 주파수 필터링
F_filtered = F × Mask
- Mask = 0 또는 1로 구성된 간단한 필터

