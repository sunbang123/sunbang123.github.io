---
layout: post
title: "The imshow function of degital image processing"
date: 2024-10-31 19:57:23 +0900
categories: 
tags: [MATLAB, Digital Image Processing]
---
# MATLAB 디지털 영상처리

## 1. 디지털 영상처리 개요

### 1.1 영상처리의 정의
1. 인간의 시각적 해석을 위한 화질 개선
2. 기계 인식을 위한 영상 처리

### 1.2 주요 응용 분야
1. 의료 분야: X-ray, MRI, CAT 스캔 분석, 세포 이미지 분석
2. 농업 분야: 위성/항공 이미지 분석, 작물 상태 검사
3. 산업 분야: 생산라인 자동 검사, 품질 관리
4. 법 집행: 지문 분석, 속도 카메라 이미지 개선

## 2. 이미지 타입과 데이터 구조

### 2.1 기본 이미지 타입
1. 이진 이미지 (Binary)
   - 픽셀당 1비트 (흑백)
   - 텍스트, 지문, 도면에 적합

2. 그레이스케일 (Greyscale)
   - 픽셀당 8비트 (0-255)
   - X-ray, 인쇄물에 주로 사용

3. RGB 컬러
   - 픽셀당 24비트
   - 적색, 녹색, 청색 각각 8비트

4. 인덱스 컬러
   - 컬러맵 사용
   - 제한된 색상 수

### 2.2 데이터 타입
- int8: -128 ~ 127
- uint8: 0 ~ 255
- int16: -32768 ~ 32767
- uint16: 0 ~ 65535
- double: 실수형

## 3. MATLAB 기본 이미지 처리

### 3.1 이미지 읽기 및 정보 확인
```matlab
w = imread('wombats.tif');            % 이미지 읽기
figure, imshow(w), impixelinfo        % 표시 및 픽셀값 확인
imfinfo('image.tif')                  % 이미지 정보 확인
```

### 3.2 이미지 타입별 처리
```matlab
% RGB 이미지
a = imread('autumn.tif');
size(a)                               % 크기 확인
a(100,200,:)                         % RGB 값 확인
impixel(a,200,100)                   % 픽셀값 반환

% 인덱스 컬러 이미지
[em,emap] = imread('emu.tif');       % 이미지와 컬러맵 함께 읽기
imshow(em,emap)                      % 컬러맵 적용하여 표시
```

## 4. 고급 이미지 처리 기법

### 4.1 비트 평면 분석
```matlab
c = imread('cameraman.tif');
cd = double(c);
% 비트 평면 분리
c0 = mod(cd,2);                      % 최하위 비트
c7 = mod(floor(cd/128),2);           % 최상위 비트

% 이미지 복원
cc = 2*(2*(2*(2*(2*(2*(2*c7+c6)+c5)+c4)+c3)+c2)+c1)+c0;
imshow(uint8(cc))
```

### 4.2 공간 해상도 조정
```matlab
x2 = imresize(imresize(x,1/2),2);    % 1/2 해상도
x4 = imresize(imresize(x,1/4),4);    % 1/4 해상도
```

### 4.3 데이터 타입 변환
```matlab
% uint8 ↔ double 변환
cd = double(c)                        % 값 유지
cd = im2double(c)                     % 0-1 정규화
c2 = uint8(255*cd)                    % 수동 변환
c3 = im2uint8(cd)                     % 자동 변환

% 컬러 타입 변환
rgb_img = ind2rgb(x,map)             % 인덱스 → RGB
gray_img = rgb2gray(rgb_img)         % RGB → 그레이스케일
```

## 5. 이미지 표시 기술

### 5.1 기본 표시 함수
```matlab
% image 함수
image(c)                              % 기본 표시
image(c), truesize, axis off         % 기본 설정
colormap(gray(247))                   % 그레이스케일 설정

% imshow 함수
imshow(x)                            % uint8 직접 표시
imshow(cd/255)                       % double 정규화 표시
```

### 5.2 이진 이미지 표시
```matlab
cl = c > 120                         % 임계값 이진화
imshow(logical(cl))                  % logical 표시
imshow(double(cl))                   % double 변환 표시
```

## 6. 작업 시 주의사항

### 6.1 표시 영향 요인
1. 주변 조명
2. 모니터 타입과 설정
3. 그래픽 카드
4. 모니터 해상도
5. 개인의 시각 시스템

### 6.2 타입 변환 주의사항
- double() vs im2double() 차이 이해
- uint8 변환 시 스케일링 주의
- 연산 전 데이터 타입 확인
- logical 플래그 상태 확인

## 7. 권장 작업 순서
1. 이미지 정보 확인 (imfinfo)
2. 적절한 방식으로 이미지 읽기 (imread)
3. 필요시 타입 변환 (im2double)
4. 이미지 처리 작업 수행
5. 결과 표시 전 타입/범위 확인
6. 적절한 방식으로 표시 (imshow)
7. 필요시 픽셀값 확인 (impixelinfo)