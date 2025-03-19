---
layout: post
title: "Git server & bitbucket"
date: 2025-03-19 09:51:29 +0900
categories: 
tags: [Git]
---

**Git 서버 직접 운영과 Bitbucket 개념 보고서**

## 1. 개요
소프트웨어 개발에서 소스 코드 관리는 필수적이며, Git은 가장 널리 사용되는 버전 관리 시스템이다. 본 보고서에서는 Git 서버를 직접 운영하는 방법과 Atlassian의 Bitbucket을 활용하는 방법에 대해 개념을 정리한다.

## 2. Git 서버 직접 운영
### 2.1 Git 서버 개념
Git 서버를 직접 운영한다는 것은, GitHub, GitLab, Bitbucket 같은 클라우드 기반 원격 저장소를 사용하지 않고, 자체 서버에서 Git을 호스팅하여 버전 관리를 수행하는 것을 의미한다.

### 2.2 Git 서버 설치 및 운영 방식
1. **서버 환경 구축**
   - 리눅스 서버 (Ubuntu, CentOS, Raspberry Pi 등) 또는 Windows 서버 준비
   - SSH를 통한 원격 접근 설정

2. **Git 설치 및 저장소 생성**
   ```bash
   sudo apt update
   sudo apt install git
   mkdir -p /home/git/myrepo.git
   cd /home/git/myrepo.git
   git init --bare
   ```

3. **사용자 접근 권한 설정**
   - SSH 키를 사용한 사용자 인증
   - Git 계정 관리 및 접근 제어

4. **클라이언트에서 원격 저장소 연결 및 사용**
   ```bash
   git clone ssh://user@yourserver.com:/home/git/myrepo.git
   git remote add origin ssh://user@yourserver.com:/home/git/myrepo.git
   git push origin main
   ```

### 2.3 Git 서버 직접 운영의 장점과 단점

| **장점** | **단점** |
|----------|----------|
| 데이터 보안 강화 (자체 관리) | 서버 유지보수 필요 |
| 비용 절감 (무료 운영 가능) | 초기 설정이 복잡함 |
| 내부 네트워크에서 안전한 사용 가능 | 접근 권한 및 인증 관리 필요 |
| 맞춤형 커스터마이징 가능 | CI/CD 연동 설정이 필요함 |

## 3. Bitbucket 개념
### 3.1 Bitbucket 소개
Bitbucket은 Atlassian에서 제공하는 Git 기반 원격 저장소 서비스로, **개발자 협업과 코드 관리**를 지원하는 플랫폼이다. GitHub 및 GitLab과 유사하지만, Jira 및 Confluence와의 연동이 강점이다.

### 3.2 Bitbucket의 주요 기능
- **Git 저장소 호스팅**: 중앙 집중형 원격 저장소 제공
- **Jira 연동**: 이슈 트래킹 및 프로젝트 관리 기능 지원
- **CI/CD 지원**: Bitbucket Pipelines를 통한 자동화 가능
- **팀 협업**: 코드 리뷰, PR(Pull Request), 권한 관리 제공

### 3.3 Bitbucket 사용 방법
1. **계정 생성 및 저장소 생성**
   - [bitbucket.org](https://bitbucket.org/)에 가입 후 새로운 Git 저장소 생성
   
2. **Git 저장소 연결 및 코드 업로드**
   ```bash
   git clone https://username@bitbucket.org/your-repo.git
   git remote add origin https://username@bitbucket.org/your-repo.git
   git push -u origin main
   ```

3. **팀 협업 및 코드 리뷰**
   - Pull Request(PR) 생성 및 코드 리뷰 요청
   - Jira와 연동하여 작업 이슈 추적
   
### 3.4 Bitbucket의 장점과 단점

| **장점** | **단점** |
|----------|----------|
| Jira 및 Confluence와 강력한 연동 | 무료 플랜의 기능 제한 |
| Bitbucket Pipelines로 CI/CD 구현 가능 | GitHub 대비 커뮤니티 규모가 작음 |
| 프라이빗 저장소를 기본 제공 | UI가 GitHub보다 다소 복잡 |

## 4. Git 서버 직접 운영 vs Bitbucket 비교

| 비교 항목 | Git 서버 직접 운영 | Bitbucket |
|----------|-----------------|-----------|
| **설치 및 유지보수** | 직접 설치 및 유지보수 필요 | Atlassian이 관리 |
| **보안 및 데이터 관리** | 자체 서버에서 완전한 통제 가능 | 클라우드 서비스 보안 적용 |
| **비용** | 하드웨어 및 네트워크 비용 필요 | 기본 무료 플랜 제공, 유료 기능 포함 |
| **협업 기능** | 직접 설정 필요 (GitLab CE, Gitea 활용 가능) | Pull Request, 코드 리뷰 지원 |
| **CI/CD 지원** | 추가 설정 필요 (Jenkins, GitHub Actions 등과 연동) | Bitbucket Pipelines 기본 제공 |

## 5. 결론

Git 서버를 직접 운영하는 것은 데이터 보안과 커스터마이징이 필요한 환경에서 유용하지만, 유지보수와 초기 설정이 복잡할 수 있다. 반면, Bitbucket은 간편한 협업과 Jira 연동을 강점으로 가지며, CI/CD 기능까지 기본 제공하여 효율적인 개발 환경을 구축할 수 있다. 선택은 프로젝트의 요구 사항과 운영 환경에 따라 달라질 것이다.

