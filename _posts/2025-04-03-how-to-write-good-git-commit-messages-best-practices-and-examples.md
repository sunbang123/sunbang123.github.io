---
layout: post
title: "How to write good git commit messages: best practices and examples"
date: 2025-04-03 02:25:32 +0900
categories: 
tags: 
---

# GitHub 커밋 메시지 작성 요령 보고서

## 1. 커밋 메시지란?
GitHub 또는 Git을 사용하는 개발에서 커밋 메시지는 **소스 코드 변경 사항의 목적과 내용을 설명하는 메시지**입니다. 커밋 메시지를 잘 작성하면 히스토리 관리, 협업, 버전 관리 자동화 등에 큰 도움이 됩니다.

---

## 2. 좋은 커밋 메시지의 조건
- **무엇을** 변경했는지 명확히
- **왜** 변경했는지 간단히
- **일관된 형식**으로 작성
- **가능하면 영어 또는 통일된 한글 톤** 사용

---

## 3. 커밋 메시지 작성 형식 (권장)

### Conventional Commits 포맷
```
<type>(optional scope): <message>
```

### 주요 Prefix (type)

| 타입      | 설명                          | 예시 |
|-----------|-------------------------------|------|
| `feat`    | 새로운 기능 추가              | `feat: 다크모드 기능 추가` |
| `fix`     | 버그 수정                     | `fix: 로그인 에러 수정` |
| `docs`    | 문서 관련 변경                | `docs: README 수정` |
| `style`   | 코드 포맷팅 (기능 X)         | `style: 세미콜론 통일` |
| `refactor`| 리팩토링 (기능 변화 없음)     | `refactor: 중복 함수 제거` |
| `test`    | 테스트 코드 추가              | `test: 유닛 테스트 작성` |
| `chore`   | 빌드, 설정, 패키지 관리 등     | `chore: ESLint 설정 추가` |

---

## 4. 실제 예시 (sunbang123 스타일 개선)

### 기존:
```
[add] c.txt 파일을 생성하고 추가함
[update] 두 파일을 수정함
```

### 개선:
```
feat: 안내 텍스트 추가 (c.txt)
refactor: 중복 코드 제거 및 문장 정리 (a.txt, b.txt)
```

### 콘텐츠 중심 커밋 예시:
```
feat: 정보처리기사 실기 포스트 업로드
docs: 포스트 이미지 경로 수정
chore: 게시글 태그 업데이트
```

---

## 5. 커밋 메시지 작성 요령 요약

| 요령 | 설명 |
|------|------|
| 1️⃣ 무엇 + 왜 | 단순히 '수정함' 말고 이유도 포함 |
| 2️⃣ prefix 사용 | `feat:`, `fix:` 등 명확한 태그로 시작 |
| 3️⃣ 목적 중심 작성 | 단순히 파일명보다 변경 목적 작성 |
| 4️⃣ 관련 작업 묶기 | 관련 있는 파일만 함께 커밋 |
| 5️⃣ 간결하고 일관되게 | '~했습니다' 보다 '~추가', '~제거' 등 추천 |

---

## 6. 유명 오픈소스 예시 (콜론 스타일 사용)

| 프로젝트 | 커밋 예시 |
|----------|------------|
| Angular | `fix(router): handle null route` |
| Vue.js  | `feat(ssr): support custom directives` |
| TypeScript | `refactor: simplify type checking logic` |
| VS Code | `chore: update dependencies` |
| Next.js | `feat(next/image): add AVIF support` |

---

## 7. SEO 관점에서의 커밋 블로그 작성 팁
Git 관련 커밋 메시지 작성법을 블로그로 정리할 때, 다음 요소들을 고려하면 검색 노출(SEO)에 더 유리합니다.

### ✅ 제목(Title)에 키워드 포함하기
- 예: `How to Write Good Git Commit Messages`
- 자주 검색되는 키워드 예시:
  - git commit message
  - how to write commits
  - best practices for git
  - conventional commits

### ✅ 본문 첫 문단에 키워드 사용
> Writing clean and effective Git commit messages is an essential skill for developers. In this guide, we'll cover best practices, common mistakes, and real examples.

### ✅ 소제목 구조화 (H2, H3 등 사용)
- 예시:
  ```markdown
  ## Why Git Commit Messages Matter
  ## Git Commit Message Format (Conventional Commits)
  ## Common Mistakes to Avoid
  ## Examples of Good and Bad Commit Messages
  ## Final Tips for Clean Git Commit History
  ```

### ✅ 콘텐츠 다양화 (코드, 표, 이미지 등)
- 코드 예제, before/after 비교, 표 등을 포함하면 SEO + 사용자 만족도 상승

### ✅ 슬러그(URL) 최적화
- `/blog/git-commit-message-guide` ✅
- `/blog/1234` ❌

### ✅ 메타 설명(meta description) 작성
- 검색 결과 요약 문장에 표시됨
- 예:
  > A complete guide to writing effective Git commit messages. Learn conventional commit types, examples, and common mistakes developers should avoid.

---

## 8. 터미널에서 디테일한 커밋 메시지 작성법
### ✅ 방법 1: 한 줄 메시지 + 설명 추가
```bash
git commit -m "docs: add blog post about writing good Git commit messages" \
            -m "Includes best practices, format examples, style comparisons, and SEO tips."
```

### ✅ 방법 2: 기본 에디터에서 직접 작성
```bash
git commit
```
이후 열리는 에디터에 아래와 같이 입력:
```
docs: add blog post about writing good Git commit messages

- Introduced best practices for writing clear commit messages
- Explained the Conventional Commits format with examples
- Compared [bracket] style and colon-based commit prefixes
- Added SEO tips for optimizing blog visibility on Google
```

### ✅ 이전 커밋 메시지 수정하기 (푸시 전)
```bash
git commit --amend
```
기존 메시지를 수정할 수 있으며, 푸시 전에만 사용하는 것이 안전합니다.

---

## 10. Vim 에디터에서 커밋 메시지 저장/종료 방법
Git에서 `git commit` 시 열리는 기본 텍스트 에디터는 보통 **Vim**입니다.

> 작동 예시

![alt text](/post_img/250403/image.png)

- O를 누르면 끼워넣기 활성화
- ESC를 누르면 저장 혹은 종료할수 있음.

| 동작 | 명령어 |
|------|--------|
| 저장 후 종료 | `:wq` + Enter |
| 저장 없이 종료 | `:q!` + Enter |
| 저장만 하기 | `:w` + Enter |
| 저장 후 종료 (빠른 방법) | `Shift + ZZ` |

### ✅ 기본 에디터 변경 방법
#### Nano로 변경 (간단한 인터페이스)
```bash
git config --global core.editor "nano"
```

---

## 11. 마무리
커밋 메시지는 단순한 메모가 아니라 **소통의 도구**라고 한다.
목적에 따라 스타일을 선택하되, 일관성을 유지하고 목적이 명확한 메시지를 작성하는 것이 가장 중요할거같다. ^^

Git 블로그를 작성할 때는 **기술적인 내용 + 검색 최적화(SEO)** 모두를 고려해서, 더 많은 개발자들에게 유용하게 전달될 수 있도록 구성해야겠다!