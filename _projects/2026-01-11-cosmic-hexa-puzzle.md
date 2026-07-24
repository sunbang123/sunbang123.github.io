---
layout: project
title: "Cosmic Hexa Puzzle"
date: 2026-01-11
last_modified_at: 2026-07-24
description: "같은 색상의 Hexa Stack을 쌓아올리는 퍼즐게임"
thumbnail: "/assets/images/thumbnail/cosmic-hexa-puzzle.png"
icon: "fas fa-code"
tags: ["Unity", "LeanTween", "Firebase", "GPGS"]
demo_url: "https://youtu.be/4Ch199SMkr4?si=pmgHzK8YOugSc2No"
github_url: "https://github.com/sunbang123/HexaStack"
status: "completed"
hobby_game: true
game_type: "퍼즐"
---

Cosmic Hexa Puzzle은 육각형 타일 더미를 빈 칸에 배치하고, 같은 색 타일을 모아 스택을 완성하는 모바일 퍼즐 게임입니다. 단순히 타일을 놓는 데서 끝나지 않고 인접 타일의 이동과 연쇄 정리를 예상해야 하도록 구성했습니다.

## 플레이 흐름

1. 화면 하단에 생성된 여러 색상의 육각형 타일 더미 중 하나를 선택합니다.
2. 선택한 더미를 그리드의 빈 칸에 배치합니다.
3. 인접한 칸의 맨 위 타일 색이 같으면 타일이 한쪽으로 이동해 같은 색 스택을 만듭니다.
4. 같은 색 타일이 기준 개수 이상 쌓이면 해당 스택이 사라지고 점수를 얻습니다.
5. 이동과 제거로 새 조합이 만들어지면 연쇄 반응이 이어집니다.
6. 그리드가 가득 차 더 이상 타일을 놓을 수 없으면 게임이 종료됩니다.

이 규칙은 조작은 한 번의 선택과 배치로 단순하게 유지하면서도, 다음 배치 공간과 연쇄 반응을 함께 판단하게 만드는 것이 목표였습니다.

## 구현 방향

- **모바일 조작:** 한 손으로도 플레이할 수 있는 선택·배치 흐름을 기준으로 UI를 구성했습니다.
- **타일 이동 연출:** LeanTween을 이용해 타일이 합쳐지고 제거되는 과정을 즉시 알아볼 수 있도록 표현했습니다.
- **데이터 연동:** Firebase와 Google Play Games Services를 실험하며 모바일 저장 및 플랫폼 연동 구조를 준비했습니다.
- **성능 기준:** Unity 2022.3 LTS와 C#을 사용하고, Android와 iOS 환경에서 저사양 기기까지 고려하는 것을 목표로 삼았습니다.

## 결과와 기록

[플레이 영상](https://youtu.be/4Ch199SMkr4?si=pmgHzK8YOugSc2No)에서 실제 조작과 타일 이동 흐름을 확인할 수 있습니다. 소스와 상세 규칙, 참고한 학습 자료는 [GitHub 저장소](https://github.com/sunbang123/HexaStack)에서 관리하고 있습니다.

기본 메커니즘을 구현한 뒤에는 반복 플레이가 단조롭지 않도록 난이도 곡선과 레벨 목표를 조정하는 일이 중요했습니다. 다음 개선 과제는 기기별 프레임과 메모리 사용량을 측정하고, 연쇄 반응이 길어질 때도 입력과 애니메이션 순서가 어긋나지 않도록 검증하는 것입니다.
