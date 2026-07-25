---
layout: post
title: "MATLAB DFT Convolution: 선형 합성곱과 제로 패딩"
date: 2024-12-09 16:49:50 +0900
last_modified_at: 2026-07-25 00:00:00 +0900
categories: []
tags: [MATLAB, Digital Image Processing, DFT, convolution]
description: "2차원 FFT로 선형 합성곱을 계산할 때 필요한 출력 크기와 제로 패딩을 정리하고, MATLAB conv2 결과와 수치 오차까지 직접 비교합니다."
---

공간 영역의 합성곱은 주파수 영역에서의 원소별 곱셈으로 바꿀 수 있다. 다만 `fft2(A).*fft2(H)`만 계산하면 언제나 `conv2(A,H)`와 같은 결과가 나오는 것은 아니다. **선형 합성곱과 순환 합성곱의 차이**, 그리고 **제로 패딩 크기**를 함께 이해해야 한다.

[이산 푸리에 변환의 수식과 주파수 좌표](/discrete-fourier/)을 먼저 보고 오면 이 글의 `fft2` 단계가 더 쉽게 연결된다.

## 선형 합성곱과 순환 합성곱

크기가 `M × N`인 이미지 `A`와 `P × Q`인 커널 `H`를 선형 합성곱하면 `full` 출력 크기는 다음과 같다.

`(M + P - 1) × (N + Q - 1)`

DFT는 입력이 주기적으로 반복된다고 가정한다. 따라서 패딩 없이 같은 크기의 DFT끼리 곱하면 영상의 오른쪽 끝이 왼쪽 끝과, 아래쪽 끝이 위쪽 끝과 이어지는 **순환 합성곱**이 된다. 선형 합성곱을 원한다면 이미지와 커널을 모두 위의 `full` 크기로 제로 패딩한 뒤 변환해야 한다.

## MATLAB에서 `conv2`와 FFT 결과 비교하기

아래 예제는 외부 이미지 파일 없이 그대로 실행할 수 있다. 64×64 이진 영상에 9×9 평균 필터를 적용하고, 공간 영역과 주파수 영역의 결과가 수치적으로 일치하는지 검사한다.

```matlab
rng default

% 재현 가능한 테스트 영상과 홀수 크기 평균 필터
A = zeros(64, 64);
A(20:44, 20:44) = 1;
H = ones(9, 9) / 81;

% 선형 합성곱의 full 출력 크기
outRows = size(A, 1) + size(H, 1) - 1;
outCols = size(A, 2) + size(H, 2) - 1;

% 공간 영역 기준값
Yspace = conv2(A, H, "full");

% 두 입력을 같은 full 크기로 제로 패딩해 주파수 영역에서 계산
FA = fft2(A, outRows, outCols);
FH = fft2(H, outRows, outCols);
Yfft = real(ifft2(FA .* FH));

maxError = max(abs(Yspace(:) - Yfft(:)));
fprintf("maximum absolute error: %.3e\n", maxError);
assert(maxError < 1e-10)

% 홀수 크기 커널일 때 원본과 같은 크기의 중앙 영역
rowStart = floor(size(H, 1) / 2) + 1;
colStart = floor(size(H, 2) / 2) + 1;
Ysame = Yfft( ...
    rowStart:rowStart + size(A, 1) - 1, ...
    colStart:colStart + size(A, 2) - 1);

tiledlayout(1, 3)
nexttile; imshow(A, []); title("input")
nexttile; imshow(H, []); title("9x9 kernel")
nexttile; imshow(Ysame, []); title("FFT convolution")
```

부동소수점 반올림 때문에 `maxError`가 정확히 0은 아닐 수 있지만, 보통 `10^-14` 안팎의 매우 작은 값이 나온다. `assert`가 실패하지 않으면 구현한 FFT 합성곱이 허용 오차 안에서 `conv2(...,"full")`과 같은 선형 합성곱임을 확인한 것이다.

## 패딩을 생략하면 생기는 경계 래핑

다음 코드는 사각형을 영상의 왼쪽 위 경계에 놓고 출력을 같은 64×64 크기로 계산한다. `psf2otf`는 커널 중심을 순환 합성곱의 원점에 맞춘 뒤 같은 크기의 주파수 응답으로 바꾼다.

```matlab
Aedge = zeros(64, 64);
Aedge(1:8, 1:8) = 1;

Hcircular = psf2otf(H, size(Aedge));
Ycircular = real(ifft2(fft2(Aedge) .* Hcircular));

tiledlayout(1, 2)
nexttile; imshow(Aedge, []);     title("input at boundary")
nexttile; imshow(Ycircular, []); title("circular convolution")
```

이 결과는 틀린 계산이라기보다 **64×64 주기의 순환 합성곱**이다. 경계의 밝은 영역이 반대편으로 감겨 들어오는 래핑을 직접 확인할 수 있다. 주기 신호를 다루는 목적이 아니라 일반적인 영상 필터링이 목적이라면 `M+P-1`, `N+Q-1` 패딩이 안전하다.

## 저역·고역 필터와 합성곱을 구분해서 보기

합성곱 정리는 계산 방법을 바꾸는 규칙이고, 어떤 성분을 통과시킬지는 커널이 결정한다.

- 평균·가우시안 커널은 급격한 변화를 줄이는 저역 통과 특성을 보여 블러와 잡음 완화에 쓰인다.
- 라플라시안이나 미분 계열 커널은 밝기 변화가 큰 부분을 강조해 경계 검출에 쓰인다.
- 특정 대역만 남기는 필터는 주기적인 텍스처나 간섭 성분을 분석할 때 유용하다.

따라서 “DFT 합성곱이 패턴을 만든다”기보다, **선택한 커널의 주파수 응답이 어떤 성분을 남기는지**가 결과를 결정한다고 표현하는 편이 정확하다.

## 언제 FFT 방식이 유리할까

작은 3×3 커널은 직접 합성곱의 준비 비용이 작아 대개 효율적이다. 반면 영상과 커널이 커질수록 직접 합성곱의 곱셈 횟수가 빠르게 늘어나므로 FFT 방식이 유리해질 수 있다. 실제 전환점은 데이터 크기, 커널 크기, 하드웨어와 라이브러리 구현에 따라 달라지므로 두 방식을 같은 입력으로 측정하는 것이 가장 확실하다.

## 실수하기 쉬운 지점

1. 이미지와 커널의 FFT 크기를 서로 다르게 지정한다.
2. `M+P-1`, `N+Q-1` 패딩 없이 선형 합성곱이라고 해석한다.
3. 실수 입력의 IFFT에 남은 아주 작은 허수부를 그대로 오류로 판단한다.
4. `full`, `same`, `valid` 출력 범위를 섞어 비교한다.
5. 커널의 중심과 경계 처리 방식을 확인하지 않고 결과 위치가 어긋났다고 판단한다.

표시 범위 때문에 결과가 검게 또는 하얗게만 보인다면 [MATLAB `imshow`의 자료형과 표시 범위](/the-imshow-function-of-degital-image-processing/)도 함께 확인하면 좋다.

## 참고 자료

- [MathWorks `fft2` 문서](https://www.mathworks.com/help/matlab/ref/fft2.html)
- [MathWorks `ifft2` 문서](https://www.mathworks.com/help/matlab/ref/ifft2.html)
- [MathWorks `conv2` 문서](https://www.mathworks.com/help/matlab/ref/conv2.html)
- [MathWorks `psf2otf` 문서](https://www.mathworks.com/help/images/ref/psf2otf.html)
