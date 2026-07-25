---
layout: post
title: "MATLAB imshow 사용법: 자료형·표시 범위·비트 평면"
date: 2024-10-31 19:57:23 +0900
last_modified_at: 2026-07-25 00:00:00 +0900
categories: []
tags: [MATLAB, Digital Image Processing, imshow]
description: "MATLAB imshow가 uint8, double, logical, RGB 영상을 해석하는 방법을 비교하고, 표시 범위 문제와 비트 평면 분해를 실행 가능한 코드로 확인합니다."
---

`imshow`는 배열의 값을 화면의 밝기나 색으로 매핑하는 함수다. 같은 숫자 배열이라도 **자료형과 지정한 표시 범위**에 따라 전혀 다르게 보일 수 있다. 영상 처리 결과가 검게 나오거나 대비가 사라졌다면 계산보다 먼저 이 규칙을 확인해야 한다.

## `imshow`가 입력을 해석하는 기본 규칙

| 입력 | 기본 해석 |
|---|---|
| `logical` 2차원 배열 | `false`는 검정, `true`는 흰색인 이진 영상 |
| `uint8` 회색조 | 전체 자료형 범위 0~255를 검정~흰색으로 표시 |
| `uint16` 회색조 | 전체 자료형 범위 0~65535를 검정~흰색으로 표시 |
| `single`, `double` 회색조 | 기본적으로 0~1을 검정~흰색으로 표시 |
| M×N×3 RGB 배열 | 세 번째 차원을 R·G·B 채널로 해석 |
| 인덱스 영상 `X`와 색상표 `map` | `imshow(X,map)` 형태로 색상표의 행을 참조 |

“회색조는 항상 8비트”, “RGB는 항상 24비트”라고 단정하면 실제 MATLAB 배열을 설명하지 못한다. 회색조와 RGB 모두 여러 정수·부동소수점 자료형을 사용할 수 있으며, 자료형에 따라 값의 허용 범위와 표시 규칙이 달라진다.

## 같은 값도 자료형에 따라 다르게 보이는 이유

다음 코드는 0부터 255까지 증가하는 그라데이션을 두 자료형으로 표시한다.

```matlab
u8 = repmat(uint8(0:255), 80, 1);
d255 = double(u8);       % 값 범위는 여전히 0~255
d01 = im2double(u8);     % 값을 0~1로 정규화

tiledlayout(1, 3)
nexttile; imshow(u8);      title("uint8: 0..255")
nexttile; imshow(d255);    title("double: interpreted as 0..1")
nexttile; imshow(d01);     title("double: 0..1")
```

`double(u8)`은 자료형만 바꾸고 값의 크기는 바꾸지 않는다. 그래서 1보다 큰 대부분의 값이 흰색으로 포화된다. 반면 `im2double(u8)`은 `uint8` 범위를 0~1로 변환하므로 원래 계조가 유지된다.

## 결과의 최소·최대값을 화면 전체에 펼치기

필터 결과가 100~140처럼 좁은 범위에 있거나 음수를 포함하면 `imshow(I)`만으로 대비가 약하게 보일 수 있다.

```matlab
I = peaks(256);  % 음수와 양수를 포함하는 재현 가능한 예제

tiledlayout(1, 2)
nexttile; imshow(I);     title("default double range: 0..1")
nexttile; imshow(I, []); title("data minimum..maximum")
```

`imshow(I,[])`는 현재 배열의 최소값을 검정, 최대값을 흰색에 대응시킨다. 이는 **화면 표시만 조절**하며 `I`의 값 자체는 바꾸지 않는다. 실제 값을 0~1 범위로 바꾼 새 배열이 필요하면 `rescale(I)`를 사용할 수 있다.

```matlab
J = rescale(I);
fprintf("J range: %.1f .. %.1f\n", min(J(:)), max(J(:)));
```

정량 분석 중에는 보기 좋게 늘어난 화면만 보고 값이 정규화되었다고 판단하지 않도록 `min`, `max`, `class`를 함께 확인하는 습관이 중요하다.

## 이진·회색조·RGB·인덱스 영상 구분

```matlab
binaryImage = rand(80, 120) > 0.65;       % logical, MxN
grayImage = uint8(repmat(0:119, 80, 1));  % uint8, MxN

rgbImage = zeros(80, 120, 3, "uint8");    % uint8, MxNx3
rgbImage(:, :, 1) = 220;                  % red channel
rgbImage(:, :, 2) = grayImage;            % green channel

indexImage = repmat(uint8(0:119), 80, 1);
map = parula(120);

tiledlayout(2, 2)
nexttile; imshow(binaryImage);          title("logical")
nexttile; imshow(grayImage);            title("grayscale")
nexttile; imshow(rgbImage);             title("RGB")
nexttile; imshow(indexImage, map);       title("indexed + colormap")
```

인덱스 영상은 픽셀 값 자체가 밝기가 아니라 색상표의 행을 가리킨다. 정수형 인덱스 영상은 값 `0`이 색상표의 첫 행을, `1`이 둘째 행을 가리키지만 `double`·`single` 인덱스 영상은 값 `1`이 첫 행을 가리킨다. 따라서 자료형을 확인해야 하며, `map` 없이 회색조처럼 표시하면 원래 의도한 색을 재현할 수 없다.

## `uint8` 영상의 비트 평면 분해

8비트 회색조 픽셀은 8개의 비트로 표현할 수 있다. `bitget(I,k)`는 각 픽셀의 k번째 비트를 `0` 또는 `1`로 꺼낸다.

```matlab
% 외부 파일 없이 생성하는 256x256 회색조 테스트 영상
[x, y] = meshgrid(uint8(0:255), uint8(0:255));
I = uint8((double(x) + double(y)) / 2);

planes = false([size(I), 8]);
for k = 1:8
    planes(:, :, k) = logical(bitget(I, k));
end

tiledlayout(2, 4)
for k = 1:8
    nexttile
    imshow(planes(:, :, k))
    title(sprintf("bit %d (weight %d)", k, 2^(k-1)))
end
```

상위 비트일수록 밝기 구조에 큰 영향을 주고, 하위 비트는 미세 변화나 잡음의 영향을 더 많이 보이는 경우가 많다. 다만 이것은 영상 내용에 따라 달라지므로 실제 비트 평면을 확인해야 한다.

### 비트 평면으로 원본 복원하기

이전 코드처럼 `c1`, `c2` 등의 정의되지 않은 변수를 사용하면 실행되지 않는다. 위에서 만든 `planes`를 가중치와 함께 더하면 원본을 정확히 복원할 수 있다.

```matlab
reconstructed = zeros(size(I), "uint16");

for k = 1:8
    reconstructed = reconstructed + ...
        uint16(planes(:, :, k)) .* uint16(2^(k-1));
end

reconstructed = uint8(reconstructed);
assert(isequal(I, reconstructed))

figure
imshow(reconstructed)
title("reconstructed from 8 bit planes")
```

중요한 점은 k번째 평면의 가중치가 `2^(k-1)`이라는 것이다. 비트 평면을 그대로 더하기만 하면 원래 밝기를 복원할 수 없다.

## 영상 표시 문제를 확인하는 순서

1. `class(I)`로 자료형을 확인한다.
2. `size(I)`로 회색조(M×N)인지 RGB(M×N×3)인지 확인한다.
3. `min(I(:))`, `max(I(:))`로 실제 값 범위를 확인한다.
4. 부동소수점 영상이면 값이 0~1인지 확인한다.
5. 회색조 영상을 관찰만 할 때는 `imshow(I,[])`, 값을 변환해야 할 때는 `im2double`이나 `rescale`을 목적에 맞게 선택한다.
6. RGB truecolor에는 `imshow(I,[])`의 표시 범위 조정이 적용되지 않는다. `single`·`double` RGB는 채널 값을 0~1 범위에 맞춰 전달한다.

이후 주파수 영역 필터링까지 연결하려면 [DFT 합성곱과 제로 패딩](/dft-convolution/)의 실행 예제를 참고할 수 있다.

## 참고 자료

- [MathWorks `imshow` 문서](https://www.mathworks.com/help/images/ref/imshow.html)
- [MathWorks: 여러 영상 자료형 표시하기](https://www.mathworks.com/help/images/display-different-image-types.html)
- [MathWorks `im2double` 문서](https://www.mathworks.com/help/matlab/ref/im2double.html)
- [MathWorks `bitget` 문서](https://www.mathworks.com/help/matlab/ref/bitget.html)
