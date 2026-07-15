---
layout: post
title: "깃 블로그 공유 썸네일 설정"
date: 2026-06-25 11:55:00 +0900
categories:
tags: ["Jekyll", "GitHub-Pages", "Open-Graph", "Kakao", "Debugging"]
description: "카카오톡 공유 썸네일이 의도와 다르게 프로필 이미지로 표시된 문제를 Jekyll SEO 태그와 Open Graph 이미지 설정으로 해결한 기록입니다."
experience_note: "블로그 링크를 메신저에 공유했을 때 실제 미리보기 이미지가 의도와 다르게 잡힌 문제를 재현하고, 메타 태그와 이미지 규격을 확인하며 해결했습니다."
---

# 블로그 공유 썸네일이 프로필 이미지로 뜨는 문제 해결

이 글은 블로그 링크를 카카오톡에 공유했을 때 대표 이미지가 의도와 다르게 표시된 문제를 직접 추적한 기록이다. 처음에는 Jekyll 설정 문제라고 생각했지만, 빌드된 HTML의 Open Graph 태그와 공유 플랫폼의 이미지 수집 방식을 함께 확인하면서 원인을 좁혀 갔다.

블로그 주소 `https://sunbang123.github.io/`를 카카오톡 같은 메신저에 공유했을 때, 내가 의도한 일러스트 형태의 기본 썸네일이 아니라 내 얼굴 프로필 이미지가 미리보기 썸네일로 크게 표시되는 문제가 있었다.

원래는 블로그 대표 이미지로 `default` 썸네일이 떠야 했다. 하지만 실제 공유 화면에서는 본문에 있는 `profile.jpg`가 잡히는 것처럼 보였다.

이번 작업에서는 Jekyll의 Open Graph 메타 태그를 확인하고, 공유 플랫폼이 안정적으로 읽을 수 있는 전용 썸네일 이미지를 만들어 문제를 해결했다.

---

## 1. 문제 상황

블로그 메인 주소를 공유하면 공유 카드에 다음 정보가 표시된다.

- 페이지 제목
- 설명
- 대표 이미지

이 대표 이미지는 보통 HTML의 `og:image` 또는 `twitter:image` 메타 태그를 기준으로 결정된다.

그런데 내 블로그에서는 대표 이미지로 쓰고 싶은 `default.png`가 있었는데도, 공유 화면에서는 프로필 이미지가 썸네일로 나타났다.

처음에는 `og:image` 설정이 빠졌거나, Jekyll SEO 설정이 잘못된 줄 알았다.

---

## 2. 메타 태그 확인

먼저 Jekyll 설정 파일인 `_config.yml`을 확인했다.

```yml
defaults:
  - scope:
      path: ""
    values:
      image: /assets/images/thumbnail/default.png
```

이미 전체 페이지의 기본 이미지가 `default.png`로 설정되어 있었다.

빌드된 HTML도 확인했다.

```html
<meta property="og:image" content="https://sunbang123.github.io/assets/images/thumbnail/default.png" />
<meta property="twitter:image" content="https://sunbang123.github.io/assets/images/thumbnail/default.png" />
```

즉, 메타 태그 자체는 정상적으로 생성되고 있었다.

그런데도 공유 플랫폼에서 프로필 이미지가 잡힌다는 것은, 공유 플랫폼이 `og:image`를 읽지 못했거나 가져오는 데 실패했을 가능성이 높았다.

---

## 3. 원인 추정

확인해보니 기존 `default.png` 파일은 다음과 같은 상태였다.

- 크기: 2752 x 1536
- 용량: 약 6.1MB
- 형식: PNG

Open Graph 이미지는 보통 1200 x 630 비율이 가장 무난하고, 용량도 너무 크지 않은 편이 좋다.

이미지 파일이 너무 크면 카카오톡, 디스코드, 페이스북 같은 공유 플랫폼이 이미지를 가져오지 못하거나, 페이지 안의 다른 이미지를 fallback으로 선택할 수 있다.

내 경우에는 `og:image`의 `default.png`를 가져오지 못하고, HTML 본문에 있는 첫 번째 프로필 이미지인 `profile.jpg`를 썸네일로 사용한 것으로 보인다.

---

## 4. 해결 방법

공유 카드 전용 이미지를 새로 만들었다.

기존 `default.png`를 기반으로 다음 조건에 맞춰 `default-og.jpg`를 생성했다.

- 크기: 1200 x 630
- 용량: 약 142KB
- 형식: JPG
- 경로: `/assets/images/thumbnail/default-og.jpg`

그리고 `_config.yml`의 기본 이미지를 새 파일로 변경했다.

```yml
defaults:
  - scope:
      path: ""
    values:
      image: /assets/images/thumbnail/default-og.jpg
```

추가로 `_includes/head.html`에 이미지 크기와 형식을 명시했다.

```html
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
```

이렇게 하면 공유 플랫폼이 이미지를 해석할 때 더 명확한 정보를 얻을 수 있다.

---

## 5. 빌드 결과 확인

Jekyll 빌드를 다시 실행한 뒤 `_site/index.html`을 확인했다.

```html
<meta property="og:image" content="https://sunbang123.github.io/assets/images/thumbnail/default-og.jpg" />
<meta property="twitter:image" content="https://sunbang123.github.io/assets/images/thumbnail/default-og.jpg" />
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
```

이제 블로그의 기본 공유 이미지는 `default-og.jpg`를 바라보게 되었다.

---

## 6. 카카오 디벨로퍼스 공유 디버거 사용


<img src="/post_img/260625/image.png" width="500px">

메타 태그를 수정해도 카카오톡 공유 화면이 바로 바뀌지 않을 수 있다.

카카오톡은 한 번 가져간 공유 정보를 캐시하기 때문이다. 그래서 수정 후에는 카카오 디벨로퍼스의 공유 디버거를 사용해서 캐시를 갱신했다.

사용한 도구:

- Kakao Developers 공유 디버거
- URL: `https://sunbang123.github.io/`

공유 디버거에서 블로그 주소를 다시 수집하도록 요청하면, 카카오가 기존에 저장해둔 썸네일 캐시를 새 메타 태그 기준으로 갱신한다.

이 과정을 거친 뒤에는 공유 미리보기에서 프로필 이미지 대신 새 기본 썸네일이 표시되도록 만들 수 있다.

---

## 7. 정리

이번 문제의 핵심은 `og:image`가 없는 것이 아니라, `og:image`로 지정한 이미지가 공유 플랫폼에서 사용하기에 너무 무거웠다는 점이었다.

해결 과정은 다음과 같다.

1. 빌드된 HTML에서 `og:image`와 `twitter:image` 확인
2. 기존 `default.png`의 크기와 용량 확인
3. 1200 x 630 크기의 가벼운 `default-og.jpg` 생성
4. Jekyll 기본 이미지 설정 변경
5. `og:image:width`, `og:image:height`, `og:image:type` 추가
6. 카카오 디벨로퍼스 공유 디버거로 캐시 갱신

블로그 공유 썸네일처럼 외부 플랫폼이 읽어가는 정보는 코드만 맞다고 끝나는 것이 아니었다.

이미지 규격, 파일 용량, 플랫폼 캐시까지 함께 확인해야 했다. 이번 작업을 통해 Open Graph 메타 태그와 공유 캐시 갱신 흐름을 조금 더 확실하게 이해할 수 있었다.
