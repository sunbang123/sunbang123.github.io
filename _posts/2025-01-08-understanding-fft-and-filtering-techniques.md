---
layout: post
title: "Understanding fft and filtering techniques"
date: 2025-01-08 18:07:14 +0900
categories: 
tags: [MATLAB, Digital Image Processing]
---

# 주파수 영역에서의 이미지 처리: FFT와 필터링 기법에 대한 이해

## 1. 기본적인 FFT 개념과 벡터 처리

### 1.1 벡터의 FFT 변환

코드의 첫 부분에서는 기본적인 FFT(Fast Fourier Transform) 연산의 특성을 보여줍니다. 벡터에 대한 FFT 변환 시 주의할 점은 다음과 같습니다:
- MATLAB에서 FFT 결과는 기본적으로 열 벡터(column vector)로 반환됩니다.
- 행 벡터의 경우 transpose(')를 사용하여 열 벡터로 변환 후 FFT를 적용하는 것이 권장됩니다.

MATLAB에서 FFT를 다룰 때의 기본적인 특성을 살펴봅시다:

```matlab
a = [1 2 3 4 5 6];
fft(a')  % column vector로 변환
fft(a)   % row vector 결과
```

![alt text](/post_img/250108/image.png)


### 1.2 순환 합성곱(Circular Convolution)

순환 합성곱은 주파수 영역에서의 중요한 연산입니다:
- conv() 함수: 선형 합성곱을 수행
- cconv() 함수: 순환 합성곱을 수행
- 순환 합성곱의 FFT는 각 신호의 FFT의 곱과 동일함을 보여줍니다. (중요한 특성)

순환 합성곱과 일반 합성곱의 차이를 보여주는 예제입니다:

```matlab
a = [1 2 3 4];
b = [5 6 7 8];
conv(a,b)     % 일반 합성곱
cconv(a,b,4)  % 순환 합성곱

% 순환 합성곱의 FFT 특성 확인
fft((cconv(a,b,4))')
fft(a').*fft(b');
ifft(ans)'
```

![alt text](/post_img/250108/image-1.png)

### 1.3 푸리에 변환의 이동성(Shifting)
시프팅 특성을 보여주는 중요한 예제입니다:

```matlab
x = [2 3 4 5 6 7 8 1];
x1 = (-1).^[0:7].*x  % 2 -3 4 -5 6 -7 8 -1

X = fft(x')
X1 = fft(x1')
```

## 2. 기본 도형 생성과 주파수 분석

### 2.1 사각형 패턴 생성

meshgrid 함수를 사용하여 다양한 기본 도형을 생성하고 이들의 주파수 특성을 분석합니다:
- 사각형: zeros와 ones를 사용하여 생성
- 원: meshgrid와 sqrt를 사용하여 거리 계산 후 임계값 적용
- 마름모: 논리 연산자를 사용한 영역 정의

```matlab
a = zeros(256, 256);
a(78:178, 78:178) = 1;
figure, imshow(a)
af = fftshift(fft2(a));
figure, fftshow(af, 'log');
```

![alt text](/post_img/250108/image-2.png)

### 2.2 마름모 패턴 생성
```matlab
[x,y] = meshgrid(1:256, 1:256);
b = (x+y<329) & (x+y>182) & (x-y>-67) & (x-y<73);
figure, imshow(b), impixelinfo
bf = fftshift(fft2(b));
figure, fftshow(bf, 'log');
```

![alt text](/post_img/250108/image-3.png)

### 2.3 원형 패턴 생성
```matlab
[x,y] = meshgrid(-128:127, -128:127);
z = sqrt(x.^2 + y.^2);
c = (z<30);
figure, imshow(c);
cf = fftshift(fft2(c));
figure, fftshow(cf, 'log');
```

![alt text](/post_img/250108/image-4.png)

## 3. 주파수 영역 필터링

### 3.1 저주파 통과 필터링(Low-pass Filtering)
```matlab
[x,y] = meshgrid(-128:127, -128:127);
z = sqrt(x.^2+y.^2);
c = (z<30);  % 저주파 통과 필터 마스크
figure, imshow(c);
cf = fftshift(fft2(c));
figure, fftshow(cf, 'log')

cm = imread('cameraman.tif');
cmf = fftshift(fft2(cm));
figure, imshow(cm);
cf = fftshift(fft2(cm));
figure, fftshow(cf);
cfl = cf.*c;
figure, fftshow(cfl, 'log');
cfli=ifft2(cfl);
figure, fftshow(cfli, 'abs');
```

![alt text](/post_img/250108/image-5.png)

### 3.2 고주파 통과 필터링(High-pass Filtering)
```matlab
[x,y] = meshgrid(-128:127, -128:127);
z = sqrt(x.^2+y.^2);
c = (z>15);  % 고주파 통과 필터 마스크
figure, imshow(c);
cf = fftshift(fft2(c));
figure, fftshow(cf, 'log')

cm = imread('cameraman.tif');
cf = fftshift(fft2(cm));
cfh = cf.*c;
figure, fftshow(cfh, 'log');
cfhi=ifft2(cfh);
figure, fftshow(cfhi, 'abs');
```

![alt text](/post_img/250108/image-6.png)

### 3.3 대역 제거 필터링(Band-reject Filtering)

```matlab
[x,y] = meshgrid(-128:127, -128:127);
z = sqrt(x.^2+y.^2);
c = (z>5 & z<20);  % 대역 제거 필터 마스크
figure, imshow(c);
cf = fftshift(fft2(c));
figure, fftshow(cf, 'log')

cm = imread('cameraman.tif');
cmf = fftshift(fft2(cm));
cfh = cf.*c;
cfhi=ifft2(cfh);
figure, fftshow(cfhi, 'abs');
```

![alt text](/post_img/250108/image-7.png)

### 3.4 가우시안 필터링

```matlab
cm = imread('cameraman.tif');
cf = fftshift(fft2(cm));

g1 = mat2gray(fspecial('gaussian',256,10));
g2 = mat2gray(fspecial('gaussian',256,30));

h1 = 1-g1;  % 고주파 통과 가우시안 필터
h2 = 1-g2;
ch1 = cf.*h1;
ch2 = cf.*h2;
chi1 = ifft2(ch1);
chi2 = ifft2(ch2);
```

### 3.5 버터워스 필터링
```matlab
cm = imread("cameraman.tif");
cf = fftshift(fft2(cm));

[x,y] = meshgrid(-128:127,-128:127);
bl = 1./(1+((x.^2+y.^2)/15).^2);  % 버터워스 저주파 통과 필터

bl = lbutter(cm,15,1);
cfbl = cf.*bl;
cfbli = ifft2(cfbl);

bh = hbutter(cm,15,1);  % 버터워스 고주파 통과 필터
cfbh = cf.*bh;
cfbhi = ifft2(cfbh);
```

## 4. 주기적 노이즈 제거 예제

```matlab
tw = imread("twins.tif");
t = rgb2gray(tw);
figure(1),imshow(t);

[x,y] = meshgrid(1:256,1:256);
p = 1+sin(x+y/1.5);  % 주기적 노이즈 생성
tp = (double(t)/128+p)/4;
figure(2),imshow(tp);

tf = fftshift(fft2(tp));
figure(3), fftshow(tf), impixelinfo;

z = sqrt((x-129).^2+(y-129).^2);

% Band reject 필터 적용
br = (z<47 | z>51);
tbr = tf.*br;
figure(4), fftshow(tbr);
tbri = ifft2(tbr);
figure(5), fftshow(tbri);

% Notch 필터 적용
tf(156,:) = 0;
tf(102,:) = 0;
tf(:,170) = 0;
tf(:,88) = 0;
figure(5), fftshow(tf);
tfi = ifft2(tf);
figure(6), fftshow(tfi);
```

![alt text](/post_img/250108/image-8.png)

## 결론

이 MATLAB 코드들은 주파수 영역에서의 이미지 처리 기법들을 포괄적으로 보여줍니다. 특히:

1. 기본적인 FFT 개념부터 시작하여
2. 다양한 기하학적 패턴의 주파수 특성 분석
3. 여러 종류의 필터링 기법 (저주파/고주파/대역제거/가우시안/버터워스)
4. 실제 이미지에서의 노이즈 제거까지

각 기법들은 서로 다른 특성과 장단점을 가지고 있으며, 목적에 맞는 적절한 필터링 방법을 선택하는 것이 중요합니다. 이러한 기법들은 이미지 처리와 컴퓨터 비전 분야에서 널리 활용되고 있습니다.

### 실제 응용 분야

1. **의료 영상 처리**
   - MRI, CT, X-ray 영상의 노이즈 제거
   - 의료 영상의 선명도 개선
   - 특정 조직이나 병변의 강조

2. **위성 영상 처리**
   - 기상 위성 이미지의 노이즈 제거
   - 지형 특징 강조
   - 대기 효과 보정

3. **산업 현장 품질 관리**
   - 제품 표면 결함 검사
   - 반도체 웨이퍼 검사
   - 인쇄 회로 기판(PCB) 검사

4. **보안 및 감시 시스템**
   - CCTV 영상 화질 개선
   - 생체 인식 시스템의 이미지 전처리
   - 번호판 인식 시스템

5. **디지털 카메라 및 스마트폰**
   - 사진의 노이즈 제거
   - 이미지 선명도 개선
   - HDR 이미지 처리

이러한 실제 응용 사례들은 주파수 영역에서의 이미지 처리가 얼마나 중요하고 실용적인지를 보여줍니다. 특히 의료 영상이나 산업용 검사 시스템에서는 높은 정확도와 신뢰성이 요구되기 때문에, 이러한 필터링 기법들의 정확한 이해와 적용이 매우 중요합니다.