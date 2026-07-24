---
layout: post
title: "GitHub Actions 자동 커밋과 잔디 그래프"
date: 2026-06-22 00:19:00 +0900
last_modified_at: 2026-07-24 00:00:00 +0900
categories: 
tags: ["Github", "web-development", "Git", "git-pages"]
description: "GitHub Actions 자동 커밋이 개인 기여도 그래프에 섞이지 않도록 봇 작성자 정보를 설정한 방법과 이유를 정리했습니다."
experience_note: "블로그 자동화 커밋이 개인 GitHub 잔디에 섞이는 문제를 발견하고, 자동 커밋 작성자 정보를 분리하며 해결한 내용을 기록했습니다."
---

## GitHub Actions 자동 커밋을 기여도 그래프(잔디)에서 제외하는 방법

이 글은 블로그 데이터를 자동으로 갱신하는 GitHub Actions를 운영하면서 생긴 작은 불편에서 출발했다. 자동 커밋이 많아질수록 실제로 코드를 작성한 기록과 기계적인 갱신 기록이 기여도 그래프에서 섞였고, 이를 분리하기 위해 커밋 작성자 정보를 어떻게 설정해야 하는지 확인했다.

<img src="/post_img/260622/image.png" width="500px" alt="GitHub Actions 자동 커밋이 반영된 GitHub 기여도 그래프">

### 1. 문제 상황

GitHub Actions를 활용해 데이터를 수집하거나 블로그를 자동 배포하는 경우, 갱신된 데이터를 저장소에 반영하기 위해 지속적인 자동 커밋이 발생한다. 이 커밋 내역이 개인 GitHub 프로필의 기여도 그래프(잔디)에 모두 반영되면, 실제 코드를 작성한 개발 활동과 기계적인 자동화 작업이 섞여 본연의 개발 기록을 확인하기 어려워진다.

### 2. 해결 방법

GitHub의 기여도 그래프는 커밋에 기록된 이메일이 사용자의 계정 이메일과 일치할 때만 활성화된다. 이를 역이용하여, GitHub Actions에서 커밋을 생성할 때 작성자 정보를 개인 이메일이 아닌 GitHub 공식 봇(Bot) 계정으로 지정하면 기여도 그래프에 반영되는 것을 막을 수 있다.

### 3. 적용 방법

자동 커밋을 위해 `stefanzweifel/git-auto-commit-action`을 사용하고 있다면, 해당 스텝의 설정 값에 커밋 주체를 봇으로 명시하는 옵션을 추가하면 된다.

```yaml
- name: Commit and push if changed
  uses: stefanzweifel/git-auto-commit-action@v5
  with:
    commit_message: "Automatic commit: Update recent GitHub activities data"
    
    # 커미터 및 작성자 정보를 GitHub 봇으로 덮어쓰기
    commit_user_name: "github-actions[bot]"
    commit_user_email: "github-actions[bot]@users.noreply.github.com"
    commit_author: "github-actions[bot] <github-actions[bot]@users.noreply.github.com>"
    
    files: |
      _data/commits_data.json
      _data/issues_data.json
      _data/releases_data.json

```

### 4. 결과

위 설정을 적용하면 저장소의 커밋 히스토리에는 파일 변경 및 업데이트 내역이 정상적으로 보존된다. 하지만 해당 커밋의 작성자가 봇으로 처리되기 때문에, 개인 프로필의 잔디에는 영향을 주지 않는다. 이를 통해 순수하게 본인이 직접 코딩하고 기여한 내역만 프로필에 깔끔하게 남길 수 있다.
