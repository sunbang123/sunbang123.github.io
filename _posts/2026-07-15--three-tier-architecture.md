---
layout: post
title: "AWS EC2·Flask·MongoDB 실습으로 구분한 Layer와 Tier"
date: 2026-07-15 14:29:42 +0900
last_modified_at: 2026-07-25 00:00:00 +0900
categories: Architecture
tags: [ "Software-Architecture", "AWS", "Flask", "MongoDB" ]
description: "논리 layer와 물리 tier를 구분하고, 한 EC2에 Flask와 MongoDB를 배포한 실습의 실제 구조·인증 문제·운영 보안 한계를 정리합니다."
experience_note: "과제에서 직접 확인한 EC2 접속·Flask API·MongoDB 인증 과정을 바탕으로 쓰되, 구현하지 않은 고가용성·다중 서버 구성은 별도로 구분했습니다."
---


최근 크래프톤에서 주도하는 부트캠프인 'SW AI 정글' 면접 과제를 하다가 AWS EC2를 활용해야 하는 항목을 마주했다. 이를 보니 작년에 진행했던 비트코인 웹 서비스 프로젝트가 떠올랐다.

당시 백엔드를 담당하던 팀원이 EC2 Free Tier 계정을 생성해 서버를 올려주었다. 그런데 내가 프론트엔드 쪽에서 테스트를 한답시고 임의의 계정 생성 디버깅 도구를 돌려 짧은 시간에 많은 엔드포인트 요청을 보냈다. 이후 팀원이 서버를 내리자는 이슈를 올렸다. 당시 CloudWatch 지표와 요청 로그를 보관하지 않아 어떤 자원이 한계에 도달했는지는 지금 단정할 수 없다. 그래서 이 경험은 “많은 요청 직후 서버를 중지했다”는 관찰과 “요청 부하가 원인이었을 것”이라는 추정을 구분해 기록한다.

이 이후에도 최근 진행한 과제에서 서버 비용 이슈가 있었다. [DevLog: AWS에 5달러 청구받았다..](https://sunbang123.github.io/devlog/2026-07-15-aws-cost-holy-moly/)

내가 직접 서버 비용 이슈를 겪고 나니 서버의 구조적 분리와 트래픽 관리가 왜 필요한지 궁금해졌다. 이참에 1계층, 2계층, 3계층 구조가 어떻게 다른지 확인하고, 최근 과제의 EC2 설정 과정을 실제 배치와 목표 구조로 나눠 정리했다.

> **이 글의 실습 범위**
>
> 프레젠테이션은 로컬 브라우저, Flask와 MongoDB는 같은 EC2 인스턴스에서 실행했다. 책임은 프레젠테이션·애플리케이션·데이터의 세 논리 layer로 나눴지만, 애플리케이션과 데이터가 독립 서버에 배포된 물리적 3-tier 구성은 아니다.

---

### 1. Layer와 Tier를 먼저 구분하기

자료마다 layer와 tier를 섞어 쓰기도 하지만, 이 글에서는 Microsoft의 N-tier 설명처럼 다음 기준을 사용한다.

- **Layer**: 프레젠테이션, 비즈니스 로직, 데이터 접근처럼 코드의 책임을 나눈 논리적 경계
- **Tier**: 별도 프로세스·서버·가상 머신처럼 네트워크를 사이에 둔 물리적 배포 경계

여러 layer를 한 tier에 배포할 수도 있다. 반대로 물리 tier를 분리하면 계층별 확장과 장애 격리가 쉬워질 수 있지만 네트워크 지연, 배포 대상, 보안 규칙과 운영 비용도 늘어난다.

**1계층 구조 (1 Tier Architecture)**

<img src="/post_img/260715/image.png" width="500px" alt="프레젠테이션·비즈니스·데이터 접근 로직과 데이터베이스가 한 서버에 있는 1계층 구조">

사용자 인터페이스, 비즈니스 로직과 데이터 저장소가 하나의 배포 대상에서 동작한다. 설치와 개발은 단순하지만 자원 확장, 장애 격리와 구성 변경의 단위가 함께 묶인다. 작은 로컬 도구에는 충분히 합리적일 수 있으므로 무조건 나쁜 구조라고 단정할 수는 없다.

**2계층 구조 (2 Tier Architecture)**

<img src="/post_img/260715/image-1.png" width="500px" alt="클라이언트 계층과 데이터 계층을 분리한 2계층 구조">

클라이언트와 데이터 서버를 별도 배포 대상으로 나누고 클라이언트가 데이터 서버와 직접 통신하는 전통적인 client-server 형태다. 물리 장비는 분리되지만 DB schema나 연결 계약이 바뀌면 클라이언트도 영향을 받을 수 있으므로 두 tier가 완전히 독립적이라고 볼 수는 없다.

**3계층 구조 (3 Tier Architecture)**

<img src="/post_img/260715/image-2.png" width="500px" alt="프레젠테이션·애플리케이션·데이터 계층을 분리한 3계층 구조">

요청 흐름을 프레젠테이션 → 애플리케이션 → 데이터 책임으로 제한한다.

* **Presentation Layer**: 브라우저나 GUI에서 입력을 받고 결과를 표시한다. HTML·CSS·클라이언트 JavaScript가 대표적이다. 다만 Next.js처럼 서버 렌더링과 API 코드를 포함할 수 있는 프레임워크 전체를 항상 프레젠테이션으로 분류해서는 안 된다.
* **Application Layer**: 요청을 검증하고 업무 규칙과 트랜잭션을 수행한다. 이 실습에서는 Flask API가 해당 역할을 했다.
* **Data Layer / Data Tier**: 데이터를 저장하고 조회하는 DBMS와 저장소다. 이 실습에서는 MongoDB가 해당한다. DB에 접근하는 Python repository 코드는 논리적 data access layer지만 실행 위치는 애플리케이션 tier일 수 있다.

논리적으로 잘 나눴다고 해서 변경 영향이 사라지는 것은 아니다. API와 schema라는 계약은 여전히 호환돼야 한다. 물리 tier까지 분리하면 애플리케이션과 데이터 자원을 독립적으로 scale up 또는 scale out하고 네트워크 규칙을 다르게 적용할 수 있지만, 이것도 실제 배포와 운영 구성이 뒷받침될 때만 얻는 장점이다.

#### 이 과제에서 실제로 실행한 배치

```text
[로컬 브라우저·프론트엔드]
          │ HTTP 요청
          ▼
[EC2 한 대]
  ├─ Flask API
  └─ MongoDB (127.0.0.1:27017)
```

책임은 세 layer로 나뉘지만 물리 배포 대상은 클라이언트와 EC2의 두 tier다. MongoDB가 Flask와 같은 인스턴스에 있으므로 EC2 장애가 나면 애플리케이션과 데이터가 함께 영향을 받는다.

#### 별도 3-tier로 확장한다면

```text
[브라우저]
    │ HTTPS
    ▼
[공개 진입점·reverse proxy]
    │ 애플리케이션 포트
    ▼
[사설 애플리케이션 tier]
    │ DB 포트
    ▼
[사설 데이터 tier]
```

이 그림은 이번 과제에서 구현한 구성이 아니라 다음 단계의 목표 구조다. 공개 인터넷에는 80/443 같은 진입점만 노출하고, 애플리케이션 포트는 진입점에서, DB 포트는 애플리케이션 보안 그룹에서만 접근하도록 제한해야 한다.

---

### 2. AWS EC2 환경 구성 및 DB 연결 세팅

최근 과제에서 애플리케이션 layer와 데이터 layer를 같은 EC2에 올렸던 환경 구성과 DB 연결 과정을 다시 짚어본다.

<img src="/post_img/260715/image-4-redacted.webp" width="500px" alt="인스턴스 ID를 마스킹한 AWS EC2 생성 완료 화면">

**EC2 인스턴스 접속과 파일 전송**

먼저 AWS에서 새 인스턴스를 생성하고, 연결 탭의 SSH 클라이언트 가이드에 적힌 대로 터미널에서 접속을 시도했다. 화면 하단의 프롬프트가 로컬 경로에서 Ubuntu 호스트로 바뀐 것으로 접속을 확인했다.

<img src="/post_img/260715/image-5-redacted.webp" width="1200px" alt="IP·키 경로·지문을 마스킹하고 Ubuntu EC2에 SSH로 접속한 터미널">


처음 접속할 때 SSH host key fingerprint가 표시된다. 이를 무조건 `yes`로 넘기면 중간자 공격을 구별할 수 없으므로 AWS가 안내하는 인스턴스 fingerprint와 대조한 뒤 신뢰해야 한다. SSH 22번 포트를 사용한다면 보안 그룹의 source를 `0.0.0.0/0`이 아니라 접속할 내 IP로 제한한다. 운영 환경에서는 인바운드 포트를 열지 않는 AWS Systems Manager Session Manager도 대안이다.

<img src="/post_img/260715/image-6-redacted.webp" width="1200px" alt="EC2 IP와 로컬 키 경로를 마스킹한 FileZilla SFTP 설정 화면">

이후 FileZilla에서 SSH 키를 이용한 **SFTP**로 파일을 전송했다. 이는 평문 FTP와 다르며 별도의 FTP 21번 포트를 열 필요가 없다. 키 파일, IP와 계정명이 화면 캡처나 저장소에 들어가지 않도록 계속 마스킹해야 한다.

**Flask 로컬 확인과 프로세스 유지 범위**

<img src="/post_img/260715/image-7.png" width="300px" alt="127.0.0.1의 Flask 테스트 API가 GET 요청에 success를 반환한 화면">


EC2 내에서 파일 전송이 끝났다면 Flask 서버를 실행하고 필요한 애플리케이션 포트만 보안 그룹에 허용한다. MongoDB가 Flask와 같은 인스턴스에 있다면 `127.0.0.1:27017`로 연결하고 27017번 포트는 인터넷에 공개하지 않는다. 데이터베이스가 별도 인스턴스에 있다면 애플리케이션 서버의 보안 그룹이나 사설 IP만 접근하도록 제한한다.

과제 검증 당시에는 터미널 종료 후에도 프로세스를 잠시 유지하려고 `nohup python app.py &`를 사용했다. 하지만 `nohup`은 재부팅 후 자동 시작, 상태 확인, 실패 재시작과 일관된 로그 관리를 해결하지 않는다. 더 중요한 점은 `python app.py`가 Flask 개발 서버를 실행하는 구성이라면 공개 서비스에 사용해서는 안 된다는 것이다.

공개 배포에는 Gunicorn·Waitress 같은 production WSGI server와 systemd 또는 관리형 플랫폼을 사용하고, 앞단 reverse proxy에서 TLS와 공개 요청을 처리하는 구성을 검토한다. 이 글에서 실제로 검증한 것은 과제용 단일 EC2 실행까지이며, production WSGI·자동 복구·TLS를 구현했다고 주장하지 않는다.

**MongoDB 유저 생성 및 백엔드 DB 연결**

<img src="/post_img/260715/image-8-redacted.webp" width="500px" alt="계정·비밀번호·UUID를 마스킹한 MongoDB 사용자 생성과 조회 결과">

```bash
# mongoDB 쉘에 들어가기
mongosh
```

- 백엔드 코드에서 연결

```python
import os
from pymongo import MongoClient

mongo_uri = os.environ.get("MONGODB_URI")
if not mongo_uri:
    raise RuntimeError("MONGODB_URI 환경 변수가 필요합니다.")

client = MongoClient(
    mongo_uri,
    serverSelectionTimeoutMS=5000,
)

# MongoClient 생성만으로 연결 성공을 단정하지 않고 명령을 실행한다.
client.admin.command("ping")
db = client.get_database("dbsparta")
```

연결 문자열에는 비밀번호가 들어가므로 소스 코드나 게시물에 직접 적지 않는다. 예를 들어 서버의 보호된 환경 설정에는 `mongodb://<사용자>:<강력한-비밀번호>@127.0.0.1:27017/?authSource=admin` 형태로 보관하고 저장소에는 실제 값을 커밋하지 않는다. 환경 변수도 화면, 프로세스 설정과 진단 로그를 통해 노출될 수 있으므로 운영에서는 AWS Secrets Manager나 Parameter Store 같은 비밀 저장소와 최소 권한을 검토한다.

`ping`은 서버 선택과 통신 여부를 빠르게 확인하기 위한 명령이다. 애플리케이션 계정의 실제 권한까지 검증하려면 개발용 collection에서 필요한 read/write 작업을 수행하고 결과와 정리 여부를 확인해야 한다.

**MongoDB 연결 트러블슈팅 및 명령어**

<img src="/post_img/260715/image-9.png" width="500px" alt="MongoDB 데이터베이스 조회 중 인증이 필요하다는 오류 메시지">

데이터 layer의 DB를 설정하고 조회하는 과정에서 `requires authentication` 오류가 발생했다. 이 화면에서는 `mongosh`에 접속할 때 사용자 정보가 빠진 것이 원인이었다. 현재 `test>` 프롬프트에 있다면 `exit`로 나온 뒤 인증 정보를 지정해 다시 접속한다.

그 후 단순 접속이 아니라, 계정 정보를 포함하여 권한을 얻은 상태로 다시 로그인해야 한다. cmd나 bash 환경에서 

<img src="/post_img/260715/image-10-redacted.webp" width="500px" alt="계정과 비밀번호를 마스킹한 mongosh 인증 접속 화면">

```bash
mongosh --username <사용자> \
  --authenticationDatabase admin \
  --password
```

`--password` 뒤에 실제 값을 적지 않으면 shell이 화면에 표시하지 않고 비밀번호를 묻는다. 비밀번호를 명령행 인자로 직접 넣으면 shell history나 프로세스 목록에 남을 수 있다. 로그인 후 권한이 허용된 DB 조회가 성공하면 **mongosh 인증**을 확인한 것이고, Flask 연결은 앞의 PyMongo 코드에서 별도로 확인해야 한다.

### 이 구성에서 적용할 보안 경계

| 대상 | 허용할 접근 | 피할 구성 |
|---|---|---|
| SSH 22 | 내 IP 또는 Session Manager | 인터넷 전체 `0.0.0.0/0` |
| HTTP/HTTPS | 공개 진입점의 80/443 | Flask debug server 직접 공개 |
| 애플리케이션 포트 | reverse proxy 또는 load balancer | 필요 없이 인터넷 전체 공개 |
| MongoDB 27017 | 같은 호스트의 loopback 또는 애플리케이션 보안 그룹 | 공인 IP 전체 공개 |
| MongoDB 계정 | 앱 DB에 필요한 최소 read/write | 애플리케이션에 관리자 권한 부여 |

MongoDB가 별도 호스트라면 방화벽뿐 아니라 TLS, 인증과 역할 기반 최소 권한도 적용한다. MongoDB 공식 보안 체크리스트 역시 접근 제어, TLS, 신뢰할 수 있는 네트워크와 제한된 bind IP를 함께 요구한다.

### 확인한 것과 확인하지 않은 것

| 구분 | 이 과제에서 남은 근거 |
|---|---|
| 확인 | EC2 SSH 접속, 로컬 Flask GET 응답, 미인증 mongosh 오류, 인증 후 DB 조회, 클라이언트와 API의 HTTP 통신 |
| 미확인 | 다중 AZ, load balancer, 자동 확장, 장애 조치, production WSGI, HTTPS 종단, 부하 한계 |

이 경계를 적어 두면 단일 EC2 실습 결과를 고가용성 3-tier 운영 결과로 오해하지 않는다.

---

### 3. 마무리

과제 내용이 노출될 수 있어 애플리케이션의 세부 화면과 데이터는 공개하지 않았다. 공개 가능한 범위에서는 Flask와 MongoDB를 연결해 로컬에서 API와 DB 저장을 확인한 뒤 Ubuntu EC2에 배포하고, 클라이언트가 서버 IP의 REST API와 HTTP로 통신하는 단계까지 진행했다.

처음에는 프레젠테이션·애플리케이션·데이터 책임을 나누면 곧바로 물리적 3-tier가 된다고 생각했다. 실제 배치를 다시 그려 보니 Flask와 MongoDB가 같은 EC2에 있어 장애와 자원 경계는 공유하고 있었다. 논리 layer와 물리 tier를 구분한 것이 이번 정리에서 가장 큰 교정이었다.

코드가 동작하는 것과 안전하게 운영되는 것은 다른 문제다. 다음에 같은 서비스를 확장한다면 실제 요청 지표를 먼저 수집하고, production WSGI, TLS, 프로세스 관리, 비밀 저장소와 계층별 보안 그룹을 순서대로 검증해야 한다.

---

### 참고 자료

- [Microsoft Azure Architecture Center: N-tier architecture style](https://learn.microsoft.com/azure/architecture/guide/architecture-styles/n-tier)
- [AWS: Serverless Multi-Tier Architectures introduction](https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/introduction.html)
- [AWS EC2: Security group rules for different use cases](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html)
- [AWS Systems Manager: Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)
- [Flask: Deploying to Production](https://flask.palletsprojects.com/en/stable/deploying/)
- [MongoDB: Security Checklist for Self-Managed Deployments](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [MongoDB PyMongo Driver: Choose a Connection Target](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/connect/connection-targets/)
- [MongoDB Shell: Connect with Authentication](https://www.mongodb.com/docs/mongodb-shell/connect/)
