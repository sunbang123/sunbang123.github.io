---
layout: post
title: "깃블로그에 커밋 목록을 가져온 방법"
date: 2025-12-11 13:29:53 +0900
categories: 
tags: Git
---

# GitHub Actions 초보자를 위한 CI/CD 자동화 가이드

## CI/CD란? 🤔

**CI/CD (Continuous Integration/Continuous Deployment)**는 코드 변경사항을 자동으로 테스트하고 배포하는 개발 방식입니다.

이 글에서는 GitHub Actions를 사용한 **반자동화 워크플로우**를 구축하면서 겪은 실제 문제들과 해결 방법을 초보자 관점에서 정리했습니다.

> **반자동화(Semi-Automation)**: 사람의 설정과 트리거는 필요하지만, 이후 과정은 자동으로 실행되는 방식

---

## 프로젝트 목표

GitHub Pages 블로그에 **최근 커밋 활동을 자동으로 표시**하기
- 매일 자정 자동 업데이트
- 수동 트리거 가능
- Push 시 자동 실행

---

## 문제 1: SSH Deploy Key 설정 🔑

### 상황
GitHub Actions에서 리포지토리에 자동으로 커밋하려면 인증이 필요합니다.

### 시도한 방법: SSH Deploy Key 사용

**1단계: SSH 키 쌍 생성**
```bash
# PowerShell 또는 터미널에서 실행
ssh-keygen -t rsa -b 4096 -C "your_deploy_key" -f deploy_key
```

이 명령어는 두 개의 파일을 생성합니다:
- `deploy_key` (Private Key - 비밀!)
- `deploy_key.pub` (Public Key - 공개 가능)

**2단계: Public Key를 GitHub에 등록**
```bash
# Public Key 내용 보기
cat deploy_key.pub
```

GitHub 리포지토리 → Settings → Deploy keys → Add deploy key
- Title: `Actions Deploy Key`
- Key: 복사한 Public Key 붙여넣기
- ⚠️ **"Allow write access" 체크 필수!**

**3단계: Private Key를 GitHub Secret에 등록**
```bash
# Private Key 내용 보기
cat deploy_key
```

GitHub 리포지토리 → Settings → Secrets and variables → Actions → New repository secret
- Name: `ACTIONS_DEPLOY_KEY`
- Value: 복사한 Private Key 붙여넣기

### 🚨 마주친 문제들

#### 문제 1-1: Secret 이름 불일치
```yaml
# YAML 파일에서
ssh-private-key: ${{ secrets.DEPLOY_KEY }}

# 실제 등록된 이름
ACTIONS_DEPLOY_KEY
```

**증상**: 
```
Error: The ssh-private-key argument is empty.
```

**해결**: Secret 이름을 정확히 일치시키기
```yaml
ssh-private-key: ${{ secrets.ACTIONS_DEPLOY_KEY }}
```

#### 문제 1-2: 키 형식 불일치 (OpenSSH vs RSA)

**증상**: 키를 등록했는데도 같은 에러 발생

**원인**: 
```bash
# 생성된 키 형식 (OpenSSH)
-----BEGIN OPENSSH PRIVATE KEY-----

# GitHub Actions가 원하는 형식 (RSA)
-----BEGIN RSA PRIVATE KEY-----
```

**해결**: 키 형식 변환
```bash
ssh-keygen -p -f deploy_key -m pem
# Enter old passphrase: (엔터)
# Enter new passphrase: (엔터)
# Enter same passphrase again: (엔터)
```

#### 문제 1-3: 읽기 전용 키

**증상**:
```
ERROR: The key you are authenticating with has been marked as read only.
fatal: Could not read from remote repository.
```

**원인**: Deploy Key 생성 시 "Allow write access" 체크 안 함

**해결**: 
- GitHub → Settings → Deploy keys → 해당 키 Edit
- ✅ "Allow write access" 체크

### 💡 더 간단한 방법: GITHUB_TOKEN 사용

SSH Deploy Key 대신 GitHub이 자동으로 제공하는 토큰 사용:

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    token: ${{ secrets.GITHUB_TOKEN }}  # 자동 제공, 설정 불필요!
```

**장점**: 별도 설정 없이 바로 작동
**단점**: 해당 리포지토리에만 접근 가능

---

## 문제 2: Bash에서 JSON 다루기 📊

### 상황
GitHub API에서 받은 JSON 데이터를 Bash 스크립트로 처리해야 했습니다.

### 잘못된 접근 (초보자가 흔히 하는 실수)

```bash
# ❌ 이렇게 하면 안 됩니다!
COMMITS=$(curl -s https://api.github.com/.../commits | jq '.[]')

for COMMIT in $COMMITS; do
    ALL_COMMITS=$(echo "$ALL_COMMITS" | jq --argjson commit "$COMMIT" '. + [$commit]')
done
```

**증상**:
```
jq: invalid JSON text passed to --argjson
Error: Process completed with exit code 2.
```

**왜 안 되나요?**

Bash의 `for` 루프는 **공백과 줄바꿈**을 기준으로 문자열을 나눕니다. JSON은 공백이 많아서 중간에 잘립니다:

```json
// 원하는 것
{"repo": "test", "message": "fix"}

// 실제로 들어가는 것 (조각남!)
{"repo":
"test",
"message":
```

### ✅ 올바른 방법: jq의 slurp 기능

```bash
# 1. JSON 객체들을 가져오기
COMMITS=$(curl -s https://api.github.com/.../commits | jq -c '.[] | {...}')

# 2. 여러 줄의 JSON을 하나의 배열로 변환 (slurp)
NEW_COMMITS_ARRAY=$(echo "$COMMITS" | jq -s '.')

# 3. 안전하게 병합
ALL_COMMITS=$(echo "$ALL_COMMITS" | jq --argjson new_commits "$NEW_COMMITS_ARRAY" '. + $new_commits')
```

**핵심**: `jq -s`는 여러 JSON 객체를 읽어서 배열 `[...]`로 만들어줍니다!

---

## 문제 3: GitHub API 404 에러 🔍

### 증상
```bash
curl https://api.github.com/users/sunbang123/repos?type=owner
# 결과: {"message": "Not Found", "status": "404"}
```

브라우저에서는 잘 되는데 Actions에서만 404!

### 원인
`?type=owner` 파라미터가 문제였습니다.

GitHub Actions의 `GITHUB_TOKEN`은 제한된 권한을 가져서, 이 필터가 제대로 작동하지 않았습니다.

### 해결
```bash
# ❌ 이렇게 하면 404
REPOS_URL="https://api.github.com/users/sunbang123/repos?type=owner"

# ✅ 파라미터 제거
REPOS_URL="https://api.github.com/users/sunbang123/repos"
```

---

## 문제 4: Jekyll의 숨은 규칙 📁

### 증상
GitHub Actions가 파일을 생성하고 푸시까지 성공했는데, 웹사이트에서는 파일을 못 찾음:

```
Error: 커밋 데이터 파일(commits_data.json)을 찾을 수 없습니다.
```

### 원인
Jekyll은 `_`로 시작하는 폴더를 기본적으로 무시합니다!

```
_data/commits_data.json  ← Jekyll이 빌드 시 제외!
```

### 해결
`_config.yml` 파일에 추가:

```yaml
include:
  - _data
```

이제 Jekyll이 `_data` 폴더를 빌드에 포함합니다.

---

## 최종 워크플로우 완성본 🎉

```yaml
# .github/workflows/fetch_commits.yml
name: Fetch GitHub Commits

on:
  push:
    branches:
      - main
  workflow_dispatch:  # 수동 실행 버튼
  schedule:
    - cron: '0 0 * * *'  # 매일 자정 자동 실행
    
permissions:
  contents: write  # 파일 생성/커밋 권한

jobs:
  fetch_and_save:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Install jq
        run: sudo apt-get install -y jq

      - name: Fetch commits
        env:
          GITHUB_USERNAME: sunbang123
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          REPOS_URL="https://api.github.com/users/${GITHUB_USERNAME}/repos"
          REPO_NAMES_RAW=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" $REPOS_URL)
          
          # 에러 체크
          if ! echo "$REPO_NAMES_RAW" | jq -e '.[].name' > /dev/null 2>&1; then
              echo "Failed to fetch repos"
              exit 1
          fi
          
          REPO_NAMES=$(echo "$REPO_NAMES_RAW" | jq -r '.[].name')
          ALL_COMMITS="[]"
          
          for REPO_NAME in $REPO_NAMES; do
              COMMITS_URL="https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/commits?per_page=5"
              COMMITS_RAW=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" $COMMITS_URL)
              
              if echo "$COMMITS_RAW" | jq -e '.[0].sha' > /dev/null 2>&1; then
                  COMMITS=$(echo "$COMMITS_RAW" | jq -c --arg repo "$REPO_NAME" '
                      .[] | {
                          repo: $repo,
                          message: .commit.message,
                          author: .commit.author.name,
                          date: .commit.author.date,
                          sha: .sha
                      }
                  ')
                  
                  if [ -n "$COMMITS" ]; then
                      # 핵심: jq -s로 안전하게 배열 변환
                      NEW_COMMITS_ARRAY=$(echo "$COMMITS" | jq -s '.')
                      ALL_COMMITS=$(echo "$ALL_COMMITS" | jq --argjson new "$NEW_COMMITS_ARRAY" '. + $new')
                  fi
              fi
          done
          
          FINAL=$(echo "$ALL_COMMITS" | jq 'sort_by(.date) | reverse')
          mkdir -p _data
          echo "$FINAL" > _data/commits_data.json
          
      - name: Commit and push
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "Update commits data"
          file_pattern: _data/commits_data.json
```

---

## 핵심 정리 📝

### 1. SSH Deploy Key 체크리스트
- [ ] Public Key를 Deploy keys에 등록
- [ ] "Allow write access" 체크
- [ ] Private Key를 Secrets에 등록
- [ ] Secret 이름이 YAML과 일치하는지 확인
- [ ] 키 형식이 RSA인지 확인 (`ssh-keygen -p -m pem`)

### 2. Bash + JSON 다룰 때
- ❌ `for` 루프로 JSON 객체 직접 순회
- ✅ `jq -s`로 배열 변환 후 `--argjson`으로 병합

### 3. GitHub API 호출 시
- `?type=owner` 같은 필터 파라미터는 조심
- 에러 처리 항상 추가 (`jq -e`로 유효성 검사)

### 4. Jekyll 사용 시
- `_`로 시작하는 폴더는 `_config.yml`에 명시적으로 포함

---

## 용어 정리 📖

- **CI/CD**: 코드 통합과 배포를 자동화하는 개발 방식
- **GitHub Actions**: GitHub에서 제공하는 CI/CD 플랫폼
- **워크플로우(Workflow)**: 자동화된 작업의 흐름
- **Secret**: 비밀번호나 키를 안전하게 저장하는 GitHub 기능
- **Deploy Key**: 특정 리포지토리에만 접근 가능한 SSH 키
- **jq**: 커맨드라인에서 JSON을 처리하는 도구
- **Slurp**: jq에서 여러 JSON 객체를 배열로 합치는 기능

---

## 다음 단계 🚀

이 가이드를 따라 했다면:
1. ✅ GitHub Actions로 자동화 구축 완료
2. ✅ SSH 키 관리 방법 습득
3. ✅ Bash 스크립트에서 안전한 JSON 처리 이해
4. ✅ Jekyll의 빌드 규칙 이해

다음으로 시도해볼 것:
- 다른 API 데이터 수집 자동화
- 테스트 자동 실행 워크플로우
- 배포 자동화 구축

---

**Tags**: `GitHub Actions`, `CI/CD`, `초보자`, `자동화`, `Bash`, `jq`, `Jekyll`
