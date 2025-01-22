---
layout: post
title: "SQL relation operations"
date: 2025-01-22 16:06:37 +0900
categories: 
tags: [Processing, License]
---

# 구조적 질의어(SQL) 완벽 가이드

> 출제 빈도: 상  
> 빈출 태그: DDL, DML, DCL, 관계 대수, 관계 해석

## SQL (Structured Query Language)

### 기본 개념
* **정의**: 데이터베이스를 제어하는 표준 언어 (관계대수 기초)
* 새로운 형태의 릴레이션을 출력
* 자연어와 유사한 구조의 고급 언어
* 정의, 조작, 제어 기능이 각각 DDL, DML, DCL로 구현

### 내장 SQL
* 프로그래밍 언어에 포함된 SQL (호스트 프로그램)
* 일반 SQL은 다수 튜플 반환 가능, 내장 SQL은 단일 튜플만 반환
* 변수-필드 이름은 달라도 되나 타입은 일치 필요

## SQL 명령어 분류

### 데이터 정의어 (DDL: Data Definition Language)
* **용도**: 데이터 조작을 위한 공간(Database Object) 정의/수정/변경
* **사용자**: DBA(Database Administration)
* **대상**: 스키마, 도메인, 테이블, 뷰, 인덱스 등

⭐ **주요 명령어**
* `CREATE`: DB객체 생성
* `ALTER`: DB객체 수정
* `DROP`: DB객체 제거
* `TRUNCATE`: DB객체 데이터 전체 삭제

### 데이터 조작어 (DML: Data Markup Language)
* 데이터 검색, 삽입, 갱신, 삭제 기능
* TCL을 통한 실행 전 상태 복구 가능

⭐ **주요 명령어**
* `INSERT`: 데이터 삽입
* `UPDATE`: 데이터 갱신
* `DELETE`: 데이터 삭제
* `SELECT`: 데이터 조회

### 데이터 제어어 (DCL: Data Control Language)
* 접근 통제와 병행 수행(공유)를 위한 제어 언어

⭐ **주요 명령어**
* `GRANT`: 사용자 권한 부여
* `REVOKE`: 사용자 권한 회수

### 트랜잭션 제어어 (TCL: Transaction Control Language)
* `COMMIT`: 트랜잭션 결과 반영
* `ROLLBACK`: 트랜잭션 작업 취소
* `CHECKPOINT`: 트랜잭션 복귀 지점 설정

## 관계해석 (Relation Calculus)

### 기본 개념
* 정보가 무엇(What)인지 정의하는 비절차적 언어
* 술어 해석 기반 (실행결과가 참/거짓으로 나타남)
* SQL문과 같은 질의어 사용
* 튜플 관계 해석과 도메인 관계 해석으로 구성

### 논리 기호
* `OR (∨)`: 원자식 간의 '또는' 연결
* `AND (∧)`: 원자식 간의 '그리고' 연결
* `NOT (¬)`: 원자식 부정

### 정량자
* `Universal Quantifier (∀)`: 모든 것에 대하여 (for all)
* `Existential Quantifier (∃)`: 어느 것 하나라도 존재 (there exists)

## 관계대수 (Relational Algebra) ⭐빈출⭐

### 기본 개념
* 정보를 어떻게(How) 유도하는지 정의하는 절차적 언어
* 주어진 릴레이션으로부터 원하는 릴레이션 유도

### 연산자 종류
* **일반 집합 연산자**: 합집합(∪), 교집합(∩), 차집합(−), 교차곱(×)
* **순수 관계 연산자**: SELECT(σ), PROJECT(π), JOIN(⨝), DIVISION(÷)

### 집합 연산
1. **합집합 (Union)**
   * `R ∪ S = {e | e ∈ R ∨ e ∈ S} = R UNION S`
   * 차수와 대응 속성의 도메인이 동일해야 함
   * 중복 제거하여 합침

2. **교집합 (Intersection)**
   * `R ∩ S = {e | e ∈ R ∧ e ∈ S} = R INTERSECT S`
   * 차수와 대응 속성의 도메인이 동일해야 함
   * 동일(중복) 튜플 추출

3. **차집합 (Difference)**
   * `R - S = {e | e ∈ R ∧ e ∉ S} = R MINUS S`
   * 차수와 대응 속성의 도메인이 동일해야 함
   * 결과는 대상 릴레이션(R)의 부분집합

4. **곱집합 (Cartesian Product)**
   * 순서쌍 집합 생성
   * 차수/도메인이 달라도 가능
   * 결과: 기수는 두 릴레이션의 곱, 차수는 두 릴레이션 차수의 합
   * 암기법: 열-차 (비)행-기

### 관계 연산
1. **SELECT**
   * 수평적(튜플) 부분 집합 추출
   * 표기: `σ <조건> (R)`
   * 예: `σ 대여횟수 > 7 (R)`

2. **PROJECT**
   * 수직적(속성) 부분 집합 추출
   * 표기: `π <리스트> (R)`
   * 예: `π 회원번호, 이름 (R)`

3. **JOIN**
   * 조건에 맞는 튜플을 합쳐 새로운 릴레이션 생성
   * 공통 속성 필요
   * 종류:
     * `R ⋈ 속성 = 속성 S`: 동일 속성 기준 조인 (중복 포함)
     * `R ⋈ N S`: 동일 속성 기준 조인 (중복 제외)
     * `R ⋈ + S`: 조건 불일치 튜플도 포함 (NULL 처리)
     * `R ⋈ θ S`: 등호 외 조건식 기준 조인

4. **DIVISION**
   * `R ÷ S`: S 속성값 기준으로 R의 나머지 속성 중 S의 모든 값 만족하는 튜플 반환

## 쿼리 최적화 규칙

### 주요 원칙
* 절대적인 최적화 규칙은 없음
* Project(수직적) 연산은 최대한 일찍 수행
* Select(수평적) 연산도 가급적 일찍 수행
* Join 연산은 성능 영향이 크므로 마지막에 수행