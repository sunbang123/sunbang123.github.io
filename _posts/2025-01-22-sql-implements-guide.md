---
layout: post
title: "Sql implements guide"
date: 2025-01-22 16:10:06 +0900
categories: 
tags: [Processing, License]
---

# SQL 활용 완벽 가이드

> 출제 빈도: 상  
> 빈출 태그: CASCADE, RESTRICT, 삭제/조회/권한 부여 문법

## 데이터 정의어 (DDL)

### CREATE
* 객체(DB, TABLE, INDEX, VIEW 등) 생성
* 메타언어 표현: `CREATE <객체유형> <객체명> <옵션>;`
  * `< >`: 입력요소 (생략가능)
  * `[ ]`: 선택요소
  * `[, ...]`: 반복가능
  * `|`: 선택가능

#### 테이블 생성 문법
```sql
CREATE TABLE <테이블명> (
    <컬럼명> <데이터유형> [<제약조건>] [, ...],
    [테이블 제약조건]
);
```

### 데이터 유형과 제약조건
* **데이터 유형**:
  * `INT`, `DOUBLE`
  * `CHAR` - 고정크기 문자열
  * `VARCHAR(N)` - 가변크기 문자열
  * `DATE`
  * `UNIQUE` - 유일키 식별자
  * `NOT NULL` - 공백 불허
  * `CHECK` - 조건식 만족값만 허용

* **제약조건**:
  * `PRIMARY KEY (<컬럼명>[, ...])` - 기본키
  * `FOREIGN KEY (<컬럼명>[, ...]) REFERENCES (<컬럼명>[, ...])`
  * `ON UPDATE <처리옵션>`
  * `ON DELETE <처리옵션>`

#### ⭐처리옵션⭐
* `NO ACTION`: 아무 작업 안함
* `SET DEFAULT`: 기본값 지정
* `SET NULL`: 공백 처리
* **CASCADE**: 관련 튜플 모두 처리
* **RESTRICT**: 관련 튜플 없는 경우만 처리
* `NULLIFY`: NULL 값으로 비움

### 테이블 구조 복사
```sql
CREATE TABLE <테이블명> AS <SELECT문>;
```

#### 예시
```sql
CREATE TABLE 학생(
    학번 INT PRIMARY KEY,
    이름 CHAR(10) NOT NULL,
    연락처 CHAR(15) DEFAULT '비공개'
);

CREATE TABLE 도서대여(
    대여일 DATE NOT NULL,
    학번 INT,
    도서명 CHAR(20) NOT NULL,
    FOREIGN KEY(학번) REFERENCES 학생(학번)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
```

### ALTER
* **컬럼 변경**:
  ```sql
  ALTER TABLE <테이블명> ADD <필드명> <데이터타입> [<위치옵션>];
  ALTER TABLE <테이블명> MODIFY <컬럼명> <데이터유형>;
  ALTER TABLE <테이블명> RENAME COLUMN <원본컬럼명> TO <변경컬럼명>;
  ```

* **컬럼 삭제**:
  ```sql
  ALTER TABLE <테이블명> DROP <컬럼명>;
  ```

* **제약조건 변경**:
  ```sql
  ALTER TABLE <테이블명> ADD CONSTRAINT <제약조건명> <제약조건>;
  ALTER TABLE <테이블명> ENABLE|DISABLE|DROP CONSTRAINT <제약조건명>;
  ```

### DROP
```sql
DROP <객체유형> <객체명> [<삭제옵션>];
TRUNCATE TABLE <테이블명>;
```

## 데이터 조작어 (DML)

### INSERT
```sql
-- 모든 값 삽입
INSERT INTO <테이블명> VALUES (<값>[, ...]);

-- 특정 컬럼 값 삽입
INSERT INTO <테이블명> (<컬럼명>[, ...]) VALUES (<값>[, ...]);

-- 다른 테이블에서 복사
INSERT INTO <테이블명> (<필드>[, ...]) <SELECT문>
```

### UPDATE
```sql
UPDATE <테이블명> SET <컬럼명>=<값>[, ...] WHERE <조건식>;
```

### DELETE
```sql
DELETE FROM <테이블명> WHERE <조건식>;
DELETE * FROM <테이블명> WHERE <조건식>;
```

### SELECT
```sql
SELECT [ALL|DISTINCT] <컬럼명>[,...] FROM <테이블명>
    [WHERE <조건식>
    [GROUP BY <컬럼명> [HAVING <조건식>]]
    [ORDER BY <컬럼명> [ASC | DESC]]];
```

## SELECT 활용

### AS (별칭)
* **집계함수**:
  * `COUNT()`: 레코드 개수
  * `SUM()/AVG()`: 합계/평균
  * `MAX()/MIN()`: 최대값/최소값
  * `STDDEV()`: 표준편차
  * `VARIAN()`: 분산

```sql
SELECT SUM(점수) AS 합계 FROM 학생정보;
SELECT 이름 AS 학생명, 점수-5 AS 성적 FROM 학생정보;
```

### ⭐윈도우 함수⭐
* **순위함수**:
  * `RANK`: 동일 순위만큼 다음 순위 건너뜀
  * `DENSE_RANK`: 동일 순위를 하나로 처리
  * `ROW_NUMBER`: 순차적 순위 부여

* **행순서 함수**:
  * `FIRST_VALUE`: 최소값
  * `LAST_VALUE`: 최대값
  * `LAG`: 이전 N번째 행의 값
  * `LEAD`: 이후 N번째 행의 값

## 조건식

### AND
```sql
SELECT * FROM 성적 WHERE 국어>=80 AND 영어>=80;
-- BETWEEN 활용
SELECT * FROM 성적 WHERE 수학 BETWEEN 80 AND 89;
```

### OR
```sql
SELECT * FROM 성적 WHERE 반="1반" OR 반="3반" OR 반="5반";
-- IN 활용
SELECT * FROM 성적 WHERE 반 IN("1반", "3반", "5반");
```

### IS NULL
```sql
SELECT * FROM 성적 WHERE 벌점 IS NULL;
```

### LIKE
```sql
SELECT * FROM 성적 WHERE 이름 LIKE <패턴>;
```
* `LIKE %동`: 동으로 끝나는 문자열
* `LIKE 홍%`: 홍으로 시작하는 문자열
* `LIKE %길%`: 길을 포함하는 문자열
* `LIKE 강_`: 강으로 시작하는 2글자
* `LIKE _강_`: 강이 가운데인 3글자
* `LIKE 강__`: 강으로 시작하는 3글자

## 하위 질의 (Sub Query)

### 서브 쿼리 기본
* 메인 쿼리 이전에 한번만 실행
* 결과값은 메인쿼리의 내부 요소

**유의사항**:
* 비교연산자 오른쪽에 기술
* 소괄호()로 감싸기
* 메인쿼리가 기대하는 행/컬럼 수와 일치
* ORDER BY 사용 불가

### 단일 행 서브쿼리
* 하나의 행으로 결과 반환
* 사용 연산자: `=`, `<>`, `>`, `>=`, `<`, `<=`

```sql
SELECT * FROM 성적 
WHERE 학과=(SELECT 학과 FROM 성적 WHERE 이름="권영석");
```

### 다중 행 서브쿼리
* 여러 행으로 결과 반환
* 사용 연산자: `IN`, `ANY`, `SOME`, `ALL`, `EXISTS`

```sql
-- IN 연산자 예시
SELECT 성명, 학년 FROM 데이터베이스 
WHERE 학번 IN (SELECT 인공지능.학번 FROM 인공지능);

-- EXISTS 연산자 예시
SELECT 성명, 학년 FROM 데이터베이스 
WHERE EXISTS (SELECT * FROM 인공지능 
              WHERE 데이터베이스.학번 = 인공지능.학번);
```

## 정렬과 그룹화

### 정렬 (ORDER BY)
```sql
-- 단일 정렬
SELECT * FROM 성적 ORDER BY 점수 DESC;

-- 다중 정렬
SELECT * FROM 성적 ORDER BY 성별 ASC, 성적 DESC;
```

### 그룹화 (GROUP BY)
```sql
-- 기본 그룹화
SELECT 성별, COUNT(*) FROM 성적 GROUP BY 성별;

-- HAVING 절 사용
SELECT 성별, COUNT(*) FROM 성적 
GROUP BY 성별 HAVING COUNT(*)<3;
```

### ⭐그룹 함수⭐
* `ROLLUP()`: 첫 칼럼의 각 그룹 합계와 전체 합계
* `CUBE()`: 모든 칼럼의 각 그룹 합계와 전체 합계
* `GROUPING SETS()`: 각 그룹별 총 합계만 표시
* `GROUPING()`: 집계 함수 지원

## 조인 (JOIN)

### INNER JOIN
```sql
SELECT * FROM <왼쪽 테이블> 
JOIN <오른쪽 테이블> 
ON <왼쪽 테이블>.<컬럼명> = <오른쪽 테이블>.<컬럼명>;
```

### OUTER JOIN
```sql
SELECT * FROM <왼쪽 테이블> 
OUTER JOIN <오른쪽 테이블> 
ON <왼쪽 테이블>.<컬럼명> = <오른쪽 테이블>.<컬럼명>;
```

### LEFT/RIGHT JOIN
```sql
-- LEFT JOIN
SELECT * FROM <왼쪽 테이블> 
LEFT JOIN <오른쪽 테이블> 
ON <왼쪽 테이블>.<컬럼명> = <오른쪽 테이블>.<컬럼명>;

-- RIGHT JOIN
SELECT * FROM <왼쪽 테이블> 
RIGHT JOIN <오른쪽 테이블> 
ON <왼쪽 테이블>.<컬럼명> = <오른쪽 테이블>.<컬럼명>;
```

## 데이터 제어어 (DCL)

### 권한 제어

#### GRANT
```sql
GRANT <권한 유형> TO <대상>
    [WITH GRANT OPTION | WITH ADMIN OPTION];
```
* `WITH GRANT OPTION`: 권한 부여/회수 가능
* `WITH ADMIN OPTION`: 권한 부여만 가능

#### REVOKE
```sql
REVOKE <권한 유형> FROM <대상>;
```

### ROLE
* 사용자 그룹 관리
* RBAC(Role Based Access Control) 방식 사용

## 트랜잭션 제어

### 트랜잭션 특징
* 논리적 연산들(DML)의 최소 단위
* **특징**: 원자성, 일관성, 고립성, 지속성

### 트랜잭션 상태
* 활동(Active)
* 완료(Committed)
* 실패(Failed)
* 철회(Aborted)
* 실행 취소(Undo)
* 다시 실행(Redo)

### 제어 명령어
* `COMMIT`: 변경사항 최종 반영
* `ROLLBACK`: 이전 상황으로 복구
* `SAVEPOINT`: ROLLBACK 지점 지정

## 절차형 SQL

### 기본 구성요소
* `DECLARE`: 정의 영역
* `BEGIN~END`: 실제 구현 영역
* `OR REPLACE`: 기존 코드 덮어쓰기

### 프로시저 (Procedure)
* 호출을 통해 실행
* 반환값 없음
* 구성: CONTROL, EXCEPTION, SQL, TRANSACTION

### 사용자 정의 함수
* 호출을 통해 실행
* 반환값 존재
* 구성: CONTROL, EXCEPTION, SQL, RETURN

### ⭐트리거 (Trigger)⭐
* 이벤트 발생 시 자동 호출
* 입출력/반환값 없음

#### 구성요소
* EVENT: 실행 조건 (필수)
* CONTROL: 순차/분기/반복 처리
* EXCEPTION: 예외 처리
* SQL: 주로 DML 사용

#### 수행 시점
* `AFTER`: 테이블 변경 후 실행
* `BEFORE`: 테이블 변경 전 실행
* `FOR EACH NOW`: 레코드마다 트리거 수행
* `NEW`: 새로운 데이터
* `OLD`: 기존 데이터

## 인덱스와 뷰

### 인덱스
* 빠른 검색을 위한 자료구조
* 기본키 설정 시 자동 생성
* 수정이 잦을수록 비효율적

#### 구현
```sql
-- 생성
CREATE [UNIQUE] INDEX <인덱스명> 
ON <테이블명>(<컬럼명>[, ...]);

-- 변경
ALTER [UNIQUE] INDEX <인덱스명> 
ON <테이블명>(<컬럼명>[, ...]);

-- 조회
SHOW INDEX FROM <테이블명>;
```

### 뷰 (View)
* 논리적 가상 테이블
* 시스템 카탈로그에 저장
* 종속 테이블 제거 시 함께 제거

#### 장점
* 논리적 독립성 유지
* 접근 방법 단순화
* 데이터 보안 유지

#### 단점
* 인덱스 사용 불가
* 수정/변경 불가

#### 구현
```sql
-- 생성
CREATE VIEW <뷰 이름>(<컬럼 목록>) 
AS SELECT문 [옵션];

-- 삭제
DROP VIEW <뷰 이름>;

-- 조회
SELECT * FROM <뷰 이름>;
```

#### 주요 옵션
* `REPLACE`: 재생성
* `FORCE`: 무조건 생성
* `NOFORCE`: 원본 테이블 존재 시에만 생성
* `WITH CHECK OPTION`: 조건 컬럼 수정 불가
* `WITH READ ONLY`: 전체 수정 불가

## 시스템 카탈로그

### 특징
* DBMS가 자동 생성
* 조회만 가능 (직접 변경 불가)
* DDL 실행 시 자동 갱신

### SQL 지원도구
* `PL/SQL`: 확장 SQL도구
* `SQL*Plus`: Oracle 제공 도구
* `APM`: 성능 모니터링
* `TKPROF`: SQL 추적/분석
* `EXPLAIN PLAN`: SQL 실행경로 분석

## 병행제어

### 문제점
* 분실된 갱신
* 모순성
* 연쇄 복귀
* 비완료 의존성

### 로킹 (Locking)
* 다른 트랜잭션 접근 제한
* 로크 단위가 클수록:
  * 병행성 낮음
  * 오버헤드 감소
* 로크 단위가 작을수록:
  * 병행성 높음
  * 오버헤드 증가

### 로킹 기법
* 타임 스탬프: 직렬 처리
* 낙관적 병행 제어: 종료 시 일괄 검사
* 다중 버전 병행 제어: 타임 스탬프 기반 버전 선택

### 회복
* 장애 발생 이전 상태로 복원
* 연산자: Undo, Redo

#### 회복 기법
* 로그 이용:
  * 즉시 갱신: 즉시 반영 + Undo
  * 지연 갱신: 완료 시 반영 + Redo
* 검사 시점:
  * CheckPoint 이전: Redo
  * CheckPoint 이후: Undo
* 그림자 페이징: 복사본 기반 회복