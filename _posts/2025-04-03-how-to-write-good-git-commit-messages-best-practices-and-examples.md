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

## 5. 대괄호 vs 콜론 스타일 비교

| 스타일 | 예시 | 추천 여부 | 비고 |
|--------|------|------------|------|
| 대괄호 | [add] 기능 추가 | △       | 개인 기록용으로는 OK, 자동화에는 비권장 |
| 콜론   | feat: 기능 추가 | ✅      | 오픈소스/팀 작업/자동화에서 표준 |

### 대괄호 스타일이 허용되는 경우:
- 혼자만 쓰는 프로젝트일 때
- 팀 내에서 컨벤션으로 정한 경우
- 메시지 일관성과 가독성을 유지할 수 있다면 문제 없음

---

## 6. 커밋 메시지 작성 요령 요약

| 요령 | 설명 |
|------|------|
| 1️⃣ 무엇 + 왜 | 단순히 '수정함' 말고 이유도 포함 |
| 2️⃣ prefix 사용 | `feat:`, `fix:` 등 명확한 태그로 시작 |
| 3️⃣ 목적 중심 작성 | 단순히 파일명보다 변경 목적 작성 |
| 4️⃣ 관련 작업 묶기 | 관련 있는 파일만 함께 커밋 |
| 5️⃣ 간결하고 일관되게 | '~했습니다' 보다 '~추가', '~제거' 등 추천 |

---

## 7. 유명 오픈소스 예시 (콜론 스타일 사용)
| 프로젝트 | 커밋 예시 |
|----------|------------|
| Angular | `fix(router): handle null route` |
| Vue.js  | `feat(ssr): support custom directives` |
| TypeScript | `refactor: simplify type checking logic` |
| VS Code | `chore: update dependencies` |
| Next.js | `feat(next/image): add AVIF support` |

---

## 8. SEO 관점에서의 커밋 블로그 작성 팁
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

## 9. 마무리
커밋 메시지는 단순한 메모가 아니라 **소통의 도구**입니다. 
특히 팀 프로젝트나 공개 레포에서는 더욱 중요해집니다. 목적에 따라 스타일을 선택하되, 일관성을 유지하고 목적이 명확한 메시지를 작성하는 것이 가장 중요합니다.

Git 블로그를 작성할 때는 **기술적인 내용 + 검색 최적화(SEO)** 모두를 고려해서, 더 많은 개발자들에게 유용하게 전달될 수 있도록 구성하는 것이 좋습니다.

