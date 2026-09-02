---
title: "구글 개발자 계정이 해지될 뻔한 사건"
date: 2026-09-02 14:13:20 +0900
tags: []
---

오랜기간 활동이 없어서, 콘솔에서 구글 개발자 계정이 해지될수 있다는 메일을 받았다.

계정은 아직 해지되지 않았으며 조치 기한은 2026년 10월 7일까지라고 전달받았다.

<br>

[현재 상태]
<br>
이메일·전화번호 인증: 모두 완료
<br>
Android 개발자 인증: 완료
<br>
앱 Cosmic Hexa Puzzle: 비공개 테스트 상태
<br>
최근 업데이트: 2026년 2월 4일
<br>
기존 번들: versionCode 2 / versionName 1.1.0

<img src="/devlog_img/260902/image-1.png" width="300px">

이전에 업로드한 그대로 버전 이름만 1.1.1로 바꾸니 거부됨.

앱의 versionCode를 3 이상으로 올려야 된다..

<img src="/devlog_img/260902/image.png" width="300px">

<img src="/devlog_img/260902/image-2.png" width="300px">

여기까지 통과하고, 다른 문제에 봉착했는데

<img src="/devlog_img/260902/image-4.png" width="300px">

2026년 8월 31일부터 Google Play 앱 업데이트는 API 36 이상이 필수라서 다시 유니티 빌드세팅으로 들어갔다.

<img src="/devlog_img/260902/image-3.png" width="300px">

Firebase/Google 라이브러리와 Unity 기본 R8(D8)의 호환성 문제로 Android 빌드 오류가 발생함.

<br>

AI의 도움으로 Gradle 설정을 수정하고 External Dependency Manager → Android Resolver → Force Resolve로 의존성을 다시 정리해 해결했다.

<br>

추가로,

<img src="/devlog_img/260902/image-5.png" width="300px">

알림창에 키 로그인 하라고 떴는데, 이 부분은 코드를 통해 이미 메뉴 탭으로 만들어두었음!

<img src="/devlog_img/260902/image-7.png" width="300px">

start AOS Build 이 버튼!

<img src="/devlog_img/260902/image-8.png" width="500px">

코드는 여기있다. XD