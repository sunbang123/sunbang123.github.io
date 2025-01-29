---
layout: post
title: "Object Oriented Programming(OOP)"
date: 2025-01-29 12:00:21 +0900
categories: 
tags: [Processing, License]
---

# 객체지향 프로그래밍 (OOP)

> 출제빈도: 상  
> 빈출태그: 클래스, 인스턴스, 상속, 추상 클래스, 인터페이스

## 클래스 설계

### 기본 특징
- main 메소드를 포함하는 클래스가 가장 먼저 실행됨
- 클래스의 구성요소에는 멤버 변수, 멤버 메소드가 있음
- 외부 접근이 불가능하도록 제한(캡슐화) 해야함

### 기본 출력 메소드
- 출력: `System.out.print()`
- 출력+줄바꿈: `System.out.println()`
- 서식에 의한 출력: `System.out.printf()`

### 접근 제한자
클래스 내 멤버들의 접근 수준을 결정하는 토큰으로, 프로그램, 패키지, 하위 클래스, 자신의 클래스 순으로 접근수준을 결정함

| 제한자 | 설명 |
|--------|------|
| public | 모든 객체에서 접근 가능 |
| default | 같은 패키지 내에서 접근 가능 |
| protected | 자신과 하위 클래스에서만 접근 가능 |
| private | 자신의 클래스에서만 접근 가능 |

## 인스턴스

### 인스턴스 생성 및 접근
```java
// 인스턴스 생성
<클래스명> <변수명> = new <클래스명>();

// 인스턴스 멤버 접근
<객체변수>.<멤버이름>
```

### 변수 종류 예시
```java
public class Variable {
    int c;                      // 인스턴스변수(멤버변수)
    static String d;            // 클래스 변수(멤버변수)
    
    void func(int c){          // 매개변수(지역변수)
        this.c = c;            // 멤버변수 c에 지역변수 c값 할당
    }
    
    public static void main(String args[]) {
        int a = 30;            // 정수형변수(지역변수)
        Variable b = new Variable(); // 참조형변수(지역변수)
        b.func(a);
    }
}
```

## 클래스 변수
- 특별한 경우가 아니라면 접근을 제한해둠
- 공유하는 데이터가 필요할 때 사용
- 선언 형식: `[<접근제한자>] static <자료형> <변수명>;`
- 클래스가 코드에 언급되는 순간 생성되며, 프로그램이 끝날 때까지 유지
- 클래스 내부에서 this로 불러옴

## 생성자 메소드
- 클래스명과 같은 이름으로 존재
- 자동으로 실행되며 별도 실행 불가
- 리턴문 사용 불가능
- 초기화 작업에 사용
- 오버로딩: 동일한 메소드명을 가진 메소드들을 개수와 유형을 기준으로 구분

## 객체지향 기술 적용

### 상속
- `extends` 키워드를 사용해서 상위클래스 지정
- 형식: `class <하위 클래스명> extends <상위 클래스명> { ... }`
- 재사용, 재정의, 추가 멤버를 확장해서 구현
- 메소드 오버라이딩: 상위 클래스의 메소드를 재정의하여 사용하는 기술

### 업캐스팅 예시
```java
class SuperObject {
    public void paint() {
        draw();
    }
    public void draw() {        // 4. 오버라이딩된 하위 클래스의 paint 호출
        draw();                 // 3. 자기자신 다시 호출함
        System.out.println("Super Object"); // 6. 마지막에 출력
    }
}

class SubObject extends SuperObject {
    public void paint() {
        super.draw();          // 2. 실제 호출되는 메소드 -> 상위 클래스의 draw 메소드 호출
    }
    public void draw() {
        System.out.println("Sub Object"); // 5. 문자열 출력
    }
}

public class Main {
    public static void main(String[] args) {
        SuperObject b = new SubObject(); // 1. 상위 참조변수로 업캐스팅
        b.paint();
    }
}

// 결과
// Sub Object
// Super Object
```

### 추상 클래스
```java
abstract class Shape {          // 추상 클래스 정의
    abstract void draw();       // 추상 메소드 정의
}

class Circle extends Shape {
    void draw() {              // 추상 메소드 오버라이딩
        System.out.println("원을 그립니다");
    }
}

class Rectangle extends Shape {
    void draw() {              // 추상 메소드 오버라이딩
        System.out.println("사각형을 그립니다");
    }
}

public class Helloworld {
    public static void main(String[] args) {
        Circle c1 = new Circle();
        Rectangle r1 = new Rectangle();
        c1.draw();             // 메소드명 통일 가능
        r1.draw();
    }
}

// 결과
// 원을 그립니다
// 사각형을 그립니다
```

### 인터페이스
다중 상속의 문제점을 해결하기 위한 방법으로, 자바는 둘 이상의 상위 클래스를 상속받는 다중상속을 금지함. 다중상속을 방지하면서 다중상속의 이점을 가지는 기능이 인터페이스임

#### 특징
- 모든 메소드가 추상 메소드로만 구성
- `interface`와 `implements` 키워드를 사용해서 구현, 상속
- 상속은 기존 클래스의 멤버를 '확장'하는 개념이지만 인터페이스는 확장된 클래스의 기능을 '제한'하거나 '변경'하는 '다형성'의 개념

```java
interface Coffee {             // 상위
    abstract void drink_coffee();
}

interface Cookie {             // 상위
    abstract void eat_cookie();
}

class Cafe implements Coffee, Cookie { // 하위
    public void drink_coffee() {
        System.out.println("커피를 마신다.");
    }
    public void eat_cookie() {
        System.out.println("쿠키를 먹는다.");
    }
    public void talk() {
        System.out.println("대화를 한다.");
    }
}

public class HelloWorld {
    public static void main(String[] args) {
        Cafe k = new Cafe();
        k.drink_coffee();
        k.eat_cookie();
        k.talk();
        
        Coffee c = k;          // 업캐스팅
        c.drink_coffee();      // 커피만 마실 수 있음
        
        Cookie x = k;          // 업캐스팅
        x.eat_cookie();        // 쿠키만 먹을 수 있음
    }
}
```

## 예외처리
- 실행 도중에 문제가 발생하면 프로그램이 멈추거나 종료되는 것을 방지하기 위한 코드
- 오타는 문법 오류(Syntax Error), 의도치 않은 작동 및 입력을 예외라고 함
- 예외를 식별할 영역을 별도로 지정해야 함

```java
public class HelloWorld {
    public static void main(String[] args) {
        try {                  // 예외 감지 영역
            <코드 영역>
        }
        catch() {              // 예외 감지 시 실행 영역
            <코드 영역>
        }
        finally {              // 무조건 실행되는 영역
            <코드 영역>
        }
    }
}
```

## 스레드(Thread)
하나의 프로세스(프로그램)에서 둘 이상의 일을 동시에 수행하는 것

### Thread 클래스 상속을 통한 구현
```java
class Box extends Thread {     // Thread 클래스 상속
    public void run() {        // run 메소드 재정의
        System.out.println("message"); // 스레드 실행 시 수행되는 영역
    }
}

public class Main {
    public static void main(String[] args) {
        Box a = new Box();     // 일반적인 객체 생성 방식
        a.start();             // 스레드 수행 메소드
    }
}

// 결과
// message
```

### Runnable 인터페이스를 통한 구현
```java
class Box implements Runnable { // implements 인터페이스 상속
    public void run() {         // run 메소드 재정의
        System.out.println("message"); // 스레드 실행 시 수행되는영역
    }
}

public class Main {
    public static void main(String[] args) {
        Thread t = new Thread(new Box()); // Thread 생성자에서 다른 생성자 호출
        t.start();              // 스레드 수행 메소드
    }
}

// 결과
// message
```

### 멀티스레딩
- 다수의 스레드를 동시에 실행
- 자원 소비를 줄일 수 있음
- 자원을 공유하므로 충돌이 일어날 가능성과 복잡한 코딩으로 버그 가능성이 커짐

#### 스레드 상태
1. **Runnable**: start 메소드로 실행이 준비된 상태
2. **Running**: run 메소드로 스레드가 실행되는 상태
3. **Blocked**: 스레드가 잠시 작업을 멈춘 단계
4. **Dead(Done)**: 스레드 수행이 완료된 상태