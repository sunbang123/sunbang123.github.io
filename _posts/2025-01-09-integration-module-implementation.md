---
layout: post
title: "연계 모듈 구현: HTTP API·메시지 큐 계약과 오류 처리"
date: 2025-01-09 21:14:48 +0900
last_modified_at: 2026-07-25 00:00:00 +0900
categories: Integration
tags: ["system-integration", "OpenAPI", "AsyncAPI", "REST", "messaging"]
description: "시스템 연계에서 동기 HTTP API와 비동기 메시징을 선택하고, 계약·멱등성·재시도·DLQ·관측성·테스트를 설계하는 방법을 주문 연계 예제로 정리합니다."
experience_note: "정보처리기사 학습용 키워드 목록을 공식 규격과 장애 시나리오에 대조해 다시 쓴 설계 예제입니다. 특정 운영 시스템을 구현했다는 의미는 아닙니다."
---

서로 다른 시스템을 연결할 때 가장 먼저 정해야 하는 것은 제품명이 아니라 **계약과 실패 처리 방식**이다. “EAI를 쓴다” 또는 “REST로 연결한다”만으로는 중복 주문, 타임아웃, 스키마 변경, 인증 실패를 어떻게 처리할지 알 수 없다.

이 글에서는 다음과 같은 가상의 주문 연계를 기준으로 설계 결정을 구체화한다.

> 주문 시스템이 `order.created` 정보를 재고 시스템에 전달한다. 예제는 설계 원리를 설명하기 위한 것이며, 실제 운영 시스템을 구현했다는 의미는 아니다.

## 연계 설계에서 먼저 답할 네 가지 질문

1. **계약**: 필드 형식, 필수 값, 버전, 성공·실패 응답은 무엇인가?
2. **상호작용**: 호출 결과가 즉시 필요한가, 나중에 처리해도 되는가?
3. **실패 처리**: 타임아웃과 중복 전달이 발생해도 안전한가?
4. **검증 근거**: 로그·메트릭·트레이스로 처리 결과를 추적할 수 있는가?

이 네 가지가 정해져야 구현체나 미들웨어를 바꾸더라도 소비자와 제공자가 같은 의미로 통신할 수 있다.

## 동기 HTTP와 비동기 메시징 선택

| 방식 | 흐름 | 적합한 상황 | 반드시 고려할 점 |
|---|---|---|---|
| 동기 HTTP API | 호출자가 요청 후 응답을 기다림 | 화면에 즉시 결과가 필요하거나 짧은 조회·검증 | 타임아웃, 상태 코드, 재시도 범위, 호출 대상 장애의 전파 |
| 비동기 메시징 | 생산자가 큐·토픽에 메시지를 넣고 소비자가 나중에 처리 | 트래픽 급증 완충, 긴 작업, 여러 소비자에게 이벤트 전달 | 중복·순서·지연, 재처리, DLQ, 최종 일관성 |
| 배치·파일 | 정해진 주기로 파일을 전달 | 대량 데이터와 마감 시각 중심 업무 | 파일 완결성, 체크섬, 재전송 단위, 부분 실패 |

비동기 방식에서 `202 Accepted` 또는 브로커의 ACK는 보통 **처리가 끝났다는 뜻이 아니라 안전하게 접수했다는 뜻**이다. 결과가 필요하다면 상태 조회 URL, 콜백 또는 결과 이벤트를 별도로 설계한다.

### EAI·Hub and Spoke·ESB를 같은 말로 쓰지 않기

EAI(Enterprise Application Integration)는 기업 내 애플리케이션을 연결하는 문제 영역이다. Point-to-Point, 중앙 허브, ESB, API, 메시지 브로커는 그 문제를 해결하는 서로 다른 방식이나 구성 요소다.

- **Point-to-Point**는 두 시스템을 직접 연결해 시작은 단순하지만 연결 수와 개별 변환 로직이 늘기 쉽다.
- **Hub and Spoke**는 라우팅·변환을 중앙 허브에 모은다. 허브를 이중화하지 않으면 단일 장애점이 될 수 있다.
- **ESB**는 중앙 통합 계층에서 연결, 프로토콜 변환, 메시지 라우팅과 데이터 변환을 수행하는 패턴이다. 레거시 시스템에는 여전히 어댑터나 커넥터가 필요할 수 있다.
- **메시지 브로커**는 큐와 토픽을 통해 생산자와 소비자를 시간적으로 분리한다. 브로커를 사용한다고 자동으로 ESB가 되는 것은 아니다.

따라서 “ESB라서 어댑터가 필요 없다”, “중앙형이라 장애 영향이 자동으로 줄어든다”처럼 제품 구성과 이중화 조건을 생략한 문장은 피해야 한다.

## 계약을 코드 밖에 명시하기

HTTP API라면 [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)으로 경로, 헤더, 요청 본문과 응답을 기계가 읽을 수 있게 작성할 수 있다. 메시지 기반 API라면 [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/v3.0.0)으로 채널, 작업, 메시지와 payload schema를 표현할 수 있다.

예를 들어 주문 메시지의 최소 계약은 다음과 같이 정할 수 있다.

```json
{
  "messageId": "01J0ORDER7M6H9A2X",
  "eventType": "order.created",
  "schemaVersion": 1,
  "occurredAt": "2026-07-25T01:30:00Z",
  "order": {
    "orderId": "ORD-20260725-001",
    "amount": 39000,
    "currency": "KRW"
  }
}
```

각 필드에는 이름뿐 아니라 다음 규칙이 필요하다.

- `messageId`: 재전송을 식별할 고유 값
- `eventType`: 소비자가 처리할 이벤트 종류
- `schemaVersion`: 호환성 판단 기준
- `occurredAt`: UTC와 ISO 8601 형식으로 고정
- `amount`: 정수 최소 단위인지 소수인지 명시
- `currency`: 허용 값을 통화 코드로 제한

HTTP 요청이라면 다음처럼 계약의 핵심을 OpenAPI에 적을 수 있다.

```yaml
openapi: 3.1.0
info:
  title: Order Integration API
  version: 1.0.0
paths:
  /v1/orders:
    post:
      parameters:
        - in: header
          name: Idempotency-Key
          required: true
          schema:
            type: string
            minLength: 16
            maxLength: 128
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/OrderCreated"
      responses:
        "202":
          description: 처리가 내구성 있게 접수됨
        "400":
          description: 형식 또는 유효성 오류
        "401":
          description: 유효한 인증 정보가 없음
        "403":
          description: 인증됐지만 작업 권한이 없음
        "409":
          description: 같은 키에 서로 다른 요청이 들어옴
        "503":
          description: 일시적으로 요청을 처리할 수 없음
components:
  schemas:
    OrderCreated:
      type: object
      additionalProperties: false
      required: [messageId, eventType, schemaVersion, occurredAt, order]
      properties:
        messageId:
          type: string
        eventType:
          const: order.created
        schemaVersion:
          type: integer
          const: 1
        occurredAt:
          type: string
          format: date-time
        order:
          type: object
          additionalProperties: false
          required: [orderId, amount, currency]
          properties:
            orderId:
              type: string
            amount:
              type: integer
              minimum: 0
            currency:
              type: string
              enum: [KRW]
```

문서와 구현이 따로 변하지 않도록 CI에서 계약 파일 문법을 검사하고, 제공자와 소비자의 테스트가 같은 schema를 사용하게 한다. SOAP 기반 서비스는 WSDL과 XSD를 주로 사용하고, HTTP API는 OpenAPI, 메시지·이벤트 API는 AsyncAPI처럼 상호작용에 맞는 계약 형식을 선택한다.

## 중복 처리를 막는 멱등성

분산 시스템에서는 “응답을 못 받았다”와 “서버가 처리하지 않았다”가 같지 않다. 서버는 주문을 저장했지만 응답이 네트워크에서 사라질 수 있다. 호출자가 그대로 재시도하면 같은 주문이 두 번 반영될 수 있다.

`Idempotency-Key` 또는 `messageId`를 저장하는 inbox를 두면 재전송을 구별할 수 있다.

```sql
CREATE TABLE integration_inbox (
    message_id     VARCHAR(128) PRIMARY KEY,
    payload_hash   CHAR(64) NOT NULL,
    status         VARCHAR(20) NOT NULL,
    processed_at   TIMESTAMP NULL
);
```

처리 순서는 다음과 같이 설계한다.

1. 트랜잭션을 시작하고 `message_id`를 inbox에 삽입한다.
2. 처음 보는 키라면 schema와 업무 규칙을 검증하고 업무 데이터를 반영한다.
3. 이미 처리한 키이고 payload hash도 같다면 저장해 둔 이전 결과를 반환한다.
4. 같은 키인데 payload가 다르면 다른 의도로 판단해 `409 Conflict`로 거절한다.
5. 업무 데이터와 inbox 상태를 같은 트랜잭션으로 커밋한다.

메시지 브로커와 업무 DB에 동시에 써야 한다면 두 저장소의 “이중 쓰기”가 실패 경계를 만든다. 이때는 업무 변경과 outbox 레코드를 한 DB 트랜잭션에 기록하고, 별도 발행기가 outbox를 브로커로 전달하는 패턴을 검토한다. “exactly once”라는 문구만 믿기보다 **중복 전달이 와도 결과가 한 번만 반영되도록 소비자를 멱등하게 만드는 것**이 안전하다.

## 타임아웃·재시도·DLQ

모든 원격 호출에는 유한한 타임아웃이 필요하다. 재시도는 실패를 숨기는 반복문이 아니라 아래 조건을 만족할 때만 사용하는 복구 정책이다.

- 연결 타임아웃, `429 Too Many Requests`, 일부 `5xx`처럼 일시적일 가능성이 있는 실패만 대상으로 한다.
- `Retry-After`가 있으면 이를 우선하고, 지수 백오프와 jitter를 적용한다.
- 시도 횟수와 전체 소요 시간에 상한을 둔다.
- 쓰기 작업은 멱등성이 보장될 때만 자동 재시도한다.
- schema 오류, 권한 부족처럼 같은 요청으로 해결되지 않는 `4xx`는 반복하지 않는다.

메시지가 제한 횟수만큼 실패하면 무한 재처리하지 말고 DLQ(Dead-Letter Queue)로 이동한다. DLQ에는 원문 전체를 무조건 복사하기보다 메시지 식별자, 실패 단계, 오류 코드, 재시도 횟수와 마지막 실패 시각을 남기고 민감 정보는 제거한다. 운영자는 DLQ 증가 알람을 받고 원인을 수정한 뒤 명시적으로 재처리해야 한다.

지속 장애에는 회복 중인 대상에 계속 부하를 주지 않도록 circuit breaker를 함께 검토한다. 재시도는 짧은 일시 장애를 회복하는 수단이고, circuit breaker는 반복 호출을 잠시 차단해 장애 확산을 막는 수단이다.

## HTTP 상태 코드를 계약으로 사용하기

[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)의 의미를 기준으로 상태 코드를 정한다.

| 코드 | 연계 모듈에서의 의미 | 자동 재시도 |
|---|---|---|
| `400 Bad Request` | JSON 형식 또는 필수 값이 잘못됨 | 아니요 |
| `401 Unauthorized` | 대상 리소스에 유효한 인증 정보가 없음. `WWW-Authenticate` challenge 포함 | 보통 아니요 |
| `403 Forbidden` | 서버가 요청을 이해했지만 수행을 거절함 | 아니요 |
| `404 Not Found` | 대상 리소스를 찾지 못했거나 존재를 공개하지 않음 | 보통 아니요 |
| `409 Conflict` | 현재 상태 또는 idempotency key와 충돌 | 원인 해결 후 |
| `429 Too Many Requests` | 요청률 제한 초과 | `Retry-After`와 정책에 따라 |
| `503 Service Unavailable` | 과부하·점검 등 일시적으로 처리 불가 | 멱등한 요청에 한해 제한적으로 |

`401`은 단순히 “로그인 실패”, `403`은 “없는 문서”라는 뜻이 아니다. 인증과 권한을 구분해야 소비자가 토큰 갱신, 사용자 안내, 재시도 여부를 올바르게 결정할 수 있다. `429`는 [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585.html#section-4)에 정의돼 있다.

## 관측성: 성공 건수만 보지 않기

연계는 여러 시스템을 지나므로 한쪽 로그만으로 실패 위치를 찾기 어렵다. 로그·메트릭·트레이스에 같은 식별자를 전파한다.

### 구조화 로그의 최소 필드

- `timestamp`, `severity`, `service`, `operation`
- `message_id` 또는 `correlation_id`
- `trace_id`, `span_id`
- `schema_version`, `attempt`
- `result`, `error_code`, `duration_ms`

비밀번호, API token, 연결 문자열, 카드번호와 전체 개인정보 payload는 로그에 남기지 않는다. [OpenTelemetry](https://opentelemetry.io/docs/what-is-opentelemetry/)는 trace·metric·log를 공통 문맥으로 연결하는 표준 도구 모음을 제공한다.

### 함께 볼 메트릭

- 수신·성공·실패·재시도 건수와 오류율
- 처리 시간의 p50·p95·p99
- 큐 깊이와 가장 오래된 메시지의 대기 시간
- DLQ 유입량과 재처리 성공률
- downstream별 timeout과 circuit breaker 상태

평균 처리 시간만 보면 일부 사용자가 겪는 긴 지연을 놓칠 수 있으므로 percentile과 오류율을 함께 본다.

## 보안 체크리스트

- 외부 및 시스템 간 통신에 TLS를 적용한다.
- 사람 계정과 연계용 서비스 계정을 분리하고 최소 권한만 부여한다.
- secret은 소스 코드와 계약 예제에 넣지 않고 secret manager 또는 보호된 환경 설정으로 주입한다.
- schema뿐 아니라 문자열 길이, 허용 enum, 금액 범위와 업무 상태 전이를 검증한다.
- 인증 token이나 개인정보가 로그·DLQ·알림 본문으로 새지 않게 마스킹한다.
- 관리자용 재처리 기능에도 인증·권한·감사 로그를 적용한다.

## 계약에서 도출한 테스트 케이스

| 시나리오 | 기대 결과 | 확인할 근거 |
|---|---|---|
| 올바른 신규 주문 | `202` 또는 성공 이벤트, 업무 데이터 1건 | 응답, DB, 성공 메트릭 |
| 같은 키와 같은 payload 재전송 | 이전 결과 반환, 중복 반영 없음 | inbox와 업무 데이터 건수 |
| 같은 키와 다른 payload | `409`, 기존 데이터 유지 | 오류 코드와 감사 로그 |
| 인증 정보 없음 | `401`, DB 변경 없음 | `WWW-Authenticate`, 실패 메트릭 |
| 인증은 됐지만 권한 없음 | `403`, DB 변경 없음 | 권한 로그 |
| 필수 필드 또는 형식 오류 | `400`, 재시도하지 않음 | schema validation 결과 |
| downstream timeout | 제한된 재시도 후 실패 또는 DLQ | attempt, duration, DLQ |
| 소비자 재시작 중 중복 전달 | 한 번만 업무 반영 | message ID와 unique constraint |
| 민감 값이 포함된 실패 | 로그·알림에서 마스킹 | 구조화 로그 샘플 |

테스트를 통과했다는 판단은 “HTTP 200이 왔다”가 아니라 **계약에 맞는 응답, 정확한 데이터 반영, 중복 방지, 관측 신호**를 함께 확인해야 한다.

## 구현 순서 요약

1. OpenAPI 또는 AsyncAPI로 계약과 버전 호환 범위를 합의한다.
2. 동기·비동기 방식을 업무 응답 시간과 결합도 기준으로 선택한다.
3. timeout, idempotency, retry budget과 DLQ 정책을 먼저 정한다.
4. 인증·권한·암호화·민감 로그 제한을 구현한다.
5. 정상·중복·지연·권한·부분 장애 테스트를 자동화한다.
6. correlation ID와 trace를 이용해 운영에서 같은 요청을 끝까지 추적한다.

## 참고 자료

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [AsyncAPI Specification 3.0.0](https://www.asyncapi.com/docs/reference/specification/v3.0.0)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [AWS Prescriptive Guidance: Asynchronous communication](https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-integrating-microservices/asynchronous.html)
- [Amazon Builders' Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)
- [Amazon Builders' Library: Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [IBM: What is an Enterprise Service Bus?](https://www.ibm.com/think/topics/esb)
- [OpenTelemetry: Logs](https://opentelemetry.io/docs/concepts/signals/logs/)
