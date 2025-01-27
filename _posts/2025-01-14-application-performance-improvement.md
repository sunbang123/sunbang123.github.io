---
layout: post
title: "Application performance improvement"
date: 2025-01-14 17:04:35 +0900
categories: 
tags: [Processing, License]
---

# 애플리케이션 성능 개선

> 출제 빈도: 상  
> 빈출 태그: 클린 코드, 코드 분석 도구, 소프트웨어 품질 평가 항목, 정형 기술 검토

## 애플리케이션 성능 측정
- 처리량, 응답시간, 경과 시간, 자원 사용률
- 시스템 플랫폼과 유사함

## 애플리케이션 성능 분석 도구

### 도구 종류
- 성능/부하/스트레스 점검 도구: 성능 측정
- 모니터링 도구: 안정적 운영을 지원함

### 주요 도구
- **성능 점검(오픈 소스)**: JMeter, LoadUI, OpenSTA
- **모니터링 도구**: Scouter, Zabbix

## 성능 저하 원인 분석

### DB 관련 성능 저하
- **DB Lock**: 대량의 데이터 과도한 업데이트
- **DB Fetch**: 많은 양의 데이터 요청, 불필요한 확정이 자주 발생

### 내부 로직 성능 저하
- 인터넷 접속 불량
- 대량, 큰 용량의 파일 업/다운로드
- 오류 처리 로직과 실제 처리 로직을 분리하지 않은 경우

### 외부 요인
- 타임아웃 발생(호출이 취소, 멈춤)
- 잘못된 환경 설정
  - 스레드풀이나 힙 메모리 크기를 너무 작게 설정
  - 네트워크 관련 장비 간 데이터 전송 실패 또는 전송 지연

## 애플리케이션 성능 개선

### Bad Code vs Clean Code

#### Bad Code
- 정제되지 않고 얽힌 스파게티 코드
- 복잡도 증가
- 오류 발생 가능성 높음

#### Clean Code
- 가독성이 높고 깔끔함
- 단순하고 의존성 낮음
- 중복이 최소화된 코드
- 이해가 쉽고 프로그래밍 속도가 빠름
- 특징: 가독성, 단순성, 의존성 최소화, 중복성 최소화, 추상화
- 추상화: 상위 객체를 통해 하위 객체들의 공통 특성을 나타내고 하위 객체에서 상세한 내용을 구현

### 최적화 기법
- 클래스는 하나의 책임만 = 응집도 높이기
- 클래스간 의존성 최소화 = 결합도 약하게 하기
- 올바른 코딩 스타일 = 코드 가독성 높이기
- 기억하기 쉽고 발음이 쉬운 용어로 이름 정의
- 적절한 주석문으로 보충

## 소스 코드 품질 분석 도구

### 분석 방법
- 인스펙션
- 정적 분석
- 동적 분석
- 증명
- 리팩토링

### 세부 설명
- **코드 인스펙션**: 코드에 존재하는 결함을 확인
- **증명**: 품질이 아주 중요한 경우 활용 (미션 크리티컬한 업무)
- **리팩토링(Refactoring)**: 코드의 기능 변경 없이 구조를 개선해서 안정성과 가독성 확보

## 소스코드 정적/동적 분석 도구

### 정적 분석 도구
- 실행 없이 코드 자체만으로 품질 분석
- **도구 종류**
  - PMD: Java 및 다른 소스코드 버그, 데드코드 분석
  - Cppcheck: C/C++ 메모리 누수, 오버플로우 분석
  - SonarQube: 소스코드 통합 플랫폼 플러그인 확장
  - Checkstyle: Java 코드 코딩 표준 준수 검사도구

### 동적 분석 도구
- 애플리케이션을 실행해서 품질 분석
- **도구 종류**
  - Avalanche: Valgrind 프레임워크 및 STP 기반 취약점 분석
  - Valgrind: 자동화된 메모리 및 스레드 결함 발견, 분석

## 소프트웨어 유지보수

### 개요
- 지속적으로 소프트웨어 기능을 개선하고 오류를 제거해서 만족도를 향상하는 활동
- 유지보수가 어려운 코드: 외계인 코드, 스파게티 코드, 문서화되지 않은 프로그램

### 부작용
- 코드 부작용: 코드 변경으로 인한 문제
- 데이터 부작용: 자료구조 변경으로 인한 문제
- 문서 부작용: 코드, 데이터 변경을 매뉴얼에 적용하지 않아 발생하는 문제

### 유지보수 유형
- **하자 보수**: 버그나 잠재적 오류 수정
- **완전 보수**: 모든 성능 문제를 완벽하게 해결 (가장 많은 비용 소모)
- **적응 보수**: 운영 환경의 변화를 반영
- **예방 보수**: 사용자 요구를 미리 예측해서 반영

## 비용 측정 방법

### BL(Belady와 Lehman)
```
M = P + K * E^(c-d)
```

### COCOMO(COnstructive Cost Model)
```
M = ACT * DE * EAF
```

### Vessey & Webber
```
M = ACT * 2.4 * [KDSI]^(1.05)
```

### 용어 설명
- M: 유지보수를 위한 노력(인원/월)
- P: 생산적인 활동에 드는 비용
- K: 통계값에서 구한 상수
- c: 복잡도
- d: 소프트웨어 지식 정도
- ACT(Annual Change Traffic): 유지보수 비율
- DE(Development Effort): 생산적인 활동에 드는 비용
- EAF(Effort Adjust Factor): 노력 조정 수치
- KDSI(Kilo Delivered Source Instruction): 1000라인 단위로 묶은 전체 라인의 수

## 소프트웨어 품질 평가

### SQA (Software Quality Assurance)
- 소프트웨어 품질 보증
- 기능과 사용자 요구사항이 일치하는지를 확인

### 정형 기술 검토 (FTR)
- 요구사항 일치 여부, 표준 준수 및 결함 발생 여부를 검토하는 정적 분석 기법
- **원칙**
  - 의제를 제한
  - 논쟁과 반박을 제한
  - 참가자의 수를 제한
  - 제품의 검토에만 집중
  - 해결책이나 개선책에 대해서 논하지 않음

## 소프트웨어 품질 목표 항목

1. **정확성(Correctness)**: 사용자의 요구사항 충족
2. **신뢰성(Reliability)**: 정확하고 일관된 결과로 요구된 기능 오류없이 수행
3. **효율성(Efficiency)**: 요구되는 기능을 수행하기 위한 최소한의 자원 소모
4. **무결성(Integrity)**: 허용되지 않은 사용이나 자료 변경을 제어
5. **유지보수 용이성(Maintainability)**: 품질 개선, 오류 수정의 용이함
6. **사용 용이성(Usability)**: 소프트웨어를 쉽게 이용
7. **검사 용이성(Testability)**: 소프트웨어를 쉽게 시험
8. **이식성(Portability)**: 다양한 하드웨어 환경에서 운용 가능하게 변경
9. **상호 운용성(Interoperability)**: 다른 소프트웨어와 무리 없이 정보 교환
10. **유연성(Flexibility)**: 소프트웨어를 쉽게 수정
11. **재사용성(Reusability)**: 소프트웨어를 다른 목적으로 사용

## 시스템 신뢰도 측정

### 주요 지표
1. **평균 무장애 시간(MTBF: Mean Time Between Failure)**
   - 평균 장애 발생 간격 평균
   - `MTBF = MTTF + MTTR`

2. **평균 장애 시간(MTTF: Mean Time To Failure)**
   - 수리 불가능 제품의 동작시간 평균
   - `MTTF = 총 동작 시간 / 사용 횟수`

3. **평균 복구 시간(MTTR: Mean Time To Repair)**
   - 고장시점부터 수리완료까지 수리시간 평균
   - `MTTR = 총 고장시간 / 사용횟수`

4. **가용성(Availability)**
   - `Availability = MTTF / MTBF`