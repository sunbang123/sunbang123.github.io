---
layout: post
title: "Data conversion"
date: 2025-01-22 16:15:42 +0900
categories: 
tags: [Processing, License]
---

# 데이터 전환 완벽 가이드

> 출제 빈도: 하  
> 빈출 태그: ETL, 데이터 정합성, 데이터 관리 책임

## 데이터 전환 프로그램 구현

### ETL (Extraction, Transformation, Loading)
* **정의**: 데이터 이관을 위한 추출(Extraction), 변환(Transformation), 적재(Loading) 과정
* **목적**: 기존 시스템의 데이터를 목표 시스템에 적합한 형식으로 변환하여 이관

### 데이터 전환 전략
* 절차의 표준화
* 검증 인원 배치를 통한 효율성과 안정성 확보
* 우선순위 결정
* 데이터 표준화 전환
* 시나리오 구성

### 데이터 전환 절차
시스템 개발 프로젝트와 유사하게 진행:
* 요구사항 분석
* 설계
* 구현
* 테스트

## 데이터 전환 프로세스

### 1. 계획 및 요건 정의
* 현행 정보 시스템(As-Is) 분석
* 목표 시스템(To-Be) 분석
* 전환 계획 수립

### 2. 설계 단계
* 데이터 전환 요건 분석
* 업무 흐름 분석
* 데이터 매핑 설계
* 검증규칙 설계

### 3. 개발 단계
* 전환 설계서 기반 프로그램 구현
* 주요 작업:
  * 전환 개발 환경 구축
  * 전환 프로그램 개발
  * 검증 프로그램 개발

### 4. 테스트 및 검증 단계

### 5. 전환 단계
원천 시스템 데이터를 목표 시스템에 적재

#### 전환 방식
1. SQL 스크립트 직접 변환 (소스 DB → 목적 DB)
2. 프로그램 직접 변환 (소스 DB → 목적 DB)
3. 프로그램 경유 변환 (소스 DB → 중간파일 → 목적 DB)

## 데이터 정합성 검증

### 검증 방안
1. **참조 무결성**

2. **산술적 정당성** (필수 진행)
   * 합계 일치 확인
   * 건수 일치 확인
   * 범위값 일치 확인

3. **물리적 정당성** (품질 향상용)
   * 데이터 관리 정책
   * 표준 관리
   * 보안 관리
   * 업무적 적합성

### 필수 검증 프로세스
* 데이터 정제 반영 확인
* 일치성 확인

### 물리 객체 검증
* 적재 후 Table별 인덱스 수 확인
* 인덱스 내용 확인
* 품질 향상을 위한 선택적 실시

## 데이터 관리 책임과 역할

### CIO/EDA
* **관점**: 개괄적
* **역할**: 관리 총괄 정책 수립

### DA (Data Architect)
* **관점**: 개념적
* **역할**: 데이터 표준 개발 및 조정

### Modeler
* **관점**: 논리적
* **역할**: 데이터 모델링 수행

### DBA (Database Administrator)
* **관점**: 물리적
* **역할**: 
  * 데이터 형상관리 수행
  * 보안 설정 담당

### User
* **관점**: 운용적
* **역할**: 데이터베이스 활용