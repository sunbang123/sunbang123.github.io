---
layout: post
title: "The imshow function of degital image processing"
date: 2024-10-31 19:57:23 +0900
categories: 
tags: [MATLAB, Digital Image Processing]
---

# MATLAB 디지털 영상처리 완전 보고서

## 1. 이미지 읽기와 기본 표시

### 1.1 기본 이미지 읽기
```matlab
w = imread('wombats.tif');  % 그레이스케일 이미지를 행렬로 읽기
```
주의사항:
- 파일명은 작은따옴표로 감싸야 함 (그렇지 않으면 변수로 인식)
- 세미콜론(;)으로 출력 억제 (큰 행렬 출력 방지)
- 결과는 행렬 w에 저장됨

### 1.2 기본 표시 방법
```matlab
figure, imshow(w), pixval on
```
세 명령어의 조합:
- figure: 새 그래픽 창 생성
- imshow(w): 행렬을 이미지로 표시
- pixval on: 픽셀값 표시 활성화

## 2. 이미지 타입별 처리

### 2.1 RGB 컬러 이미지
```matlab
a = imread('autumn.tif');
size(a)               % 3차원 행렬 크기 반환
a(100,200,2)         % 특정 위치의 녹색값
a(100,200,:)         % 특정 위치의 모든 RGB값
impixel(a,200,100)   % 픽셀값 반환 (열,행 순서)
```

### 2.2 인덱스 컬러 이미지
```matlab
[em,emap] = imread('emu.tif');  % 이미지와 컬러맵 함께 읽기
figure, imshow(em,emap), pixval on
```

### 2.3 이미지 정보 확인
```matlab
imfinfo('emu.tif')   % 파일 정보 반환
```
반환 정보: 파일명, 크기, 포맷, 너비, 높이, 비트심도, 컬러타입 등

## 3. 데이터 타입과 변환

### 3.1 지원 데이터 타입
- int8: -128 ~ 127
- uint8: 0 ~ 255
- int16: -32768 ~ 32767
- uint16: 0 ~ 65535
- double: 머신 의존적

### 3.2 타입 변환 함수들
```matlab
% 그레이스케일 변환
ind2gray(x,map)    % 인덱스 → 그레이스케일
gray2ind(x)        % 그레이스케일 → 인덱스
rgb2gray(x)        % RGB → 그레이스케일
gray2rgb(x)        % 그레이스케일 → RGB
rgb2ind(x)         % RGB → 인덱스
ind2rgb(x,map)     % 인덱스 → RGB
```

### 3.3 double/uint8 변환
```matlab
% uint8에서 double로
cd = double(c)      % 값 유지, 타입만 변환
cd = im2double(c)   % 0-1 범위로 정규화

% double에서 uint8로
c2 = uint8(255*cd)  % 수동 변환
c3 = im2uint8(cd)   % 자동 변환 (권장)
```

## 4. 이미지 표시 기술

### 4.1 image 함수 사용
```matlab
image(c)                                      % 기본 표시
image(c), truesize, axis off                 % 기본 설정
image(c), truesize, axis off, colormap(gray(247))  % 그레이스케일 설정
```

### 4.2 imshow 함수 사용
```matlab
imshow(x)           % uint8 직접 표시
cd = double(c)      % double 변환
imshow(cd/255)      % 0-1 범위로 정규화
imshow(cd/512)      % 어둡게 표시
imshow(cd/128)      % 밝게 표시
```

## 5. 이진 이미지 처리

### 5.1 이진화 및 표시
```matlab
cl = c > 120        % 임계값으로 이진화
imshow(cl)          % logical 이미지 표시
cl = +cl            % logical 플래그 제거
```

### 5.2 이진 이미지 표시 방법
```matlab
imshow(logical(cl)) % logical 플래그 설정
imshow(double(cl))  % double로 변환
```

## 6. 이미지 표시 영향 요인
1. 주변 조명
2. 모니터 타입과 설정
3. 그래픽 카드
4. 모니터 해상도
5. 개인의 시각 시스템

## 7. 작업 시 주의사항

### 7.1 타입 변환
- double() vs im2double() 차이 이해
- uint8 변환 시 스케일링 주의
- 연산 전 데이터 타입 확인

### 7.2 이미지 표시
- 컬러맵 설정 확인
- 값 범위 확인 (특히 double 타입)
- logical 플래그 상태 확인

## 8. 권장 작업 순서
1. 이미지 정보 확인 (imfinfo)
2. 적절한 방식으로 이미지 읽기 (imread)
3. 필요시 타입 변환 (im2double)
4. 이미지 처리 작업 수행
5. 결과 표시 전 타입/범위 확인
6. 적절한 방식으로 표시 (imshow)
7. 필요시 픽셀값 확인 (pixval on)

## 9. 컬러맵 사용
- 기본: jet (64색)
- 그레이스케일: gray(n)
- 인덱스 이미지: 자체 컬러맵
- 컬러맵 크기는 이미지의 gray level 수에 맞춤