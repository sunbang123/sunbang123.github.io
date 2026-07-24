---
layout: post
title: "C 배열과 포인터: 함수 인자와 2차원 배열 주소 추적"
date: 2025-01-27 22:39:22 +0900
last_modified_at: 2026-07-24 00:00:00 +0900
categories:
tags: [c, array, pointer, computer-science]
description: "C 배열과 포인터를 식의 타입과 실행 결과로 추적하며 배열-포인터 변환, 값 전달, 포인터 산술, 2차원 배열을 설명합니다."
---

# C 배열과 포인터를 식의 타입으로 추적하기

배열과 포인터는 주소를 외우는 것보다 **각 식의 타입과 그 식이 가리키는 원소**를 순서대로 추적하면 이해하기 쉽다. 이 글에서는 1차원 배열, 함수 인자, 2차원 배열을 같은 방법으로 해석한다. 예제는 표준 C11 문법을 기준으로 한다.

## 1. 배열은 포인터가 아니지만, 대부분의 식에서 포인터로 변환된다

```c
#include <stdio.h>

int main(void)
{
    int values[4] = {10, 20, 30, 40};
    int *p = values;

    printf("count=%zu\n", sizeof values / sizeof values[0]);
    printf("*p=%d\n", *p);
    printf("p[2]=%d\n", p[2]);
    printf("*(p+2)=%d\n", *(p + 2));
    return 0;
}
```

실행 결과:

```text
count=4
*p=10
p[2]=30
*(p+2)=30
```

`values`의 선언된 타입은 `int[4]`다. 다만 대부분의 식에서 `values`는 첫 원소를 가리키는 `int *`로 변환된다. 배열 자체와 포인터 변수를 같은 것으로 보면 안 되는 이유는 `sizeof`에서 드러난다.

| 식 | 타입 또는 결과 | 의미 |
|---|---|---|
| `values` | 대부분의 식에서 `int *`로 변환 | `&values[0]` |
| `p` | `int *` | 첫 원소를 가리키는 포인터 변수 |
| `sizeof values` | 배열 전체의 바이트 수 | 포인터로 변환되지 않음 |
| `&values` | `int (*)[4]` | 배열 전체를 가리키는 포인터 |
| `p[2]` | `int` | `*(p + 2)`와 같은 원소 |

`sizeof values / sizeof values[0]`는 배열이 선언된 범위에서 원소 개수를 구한다. 배열을 함수 매개변수로 넘기면 배열 매개변수는 포인터로 조정되므로, 함수 안에서는 이 식으로 원래 길이를 복원할 수 없다. 길이를 별도 인자로 전달해야 한다.

## 2. 일부만 초기화하면 나머지는 0이 된다

{% raw %}
```c
int full[2][3] = {{1, 2, 3}, {4, 5, 6}};
int partial[2][3] = {{1, 2}, {4, 5}};
```
{% endraw %}

`partial[0]`의 실제 값은 `{1, 2, 0}`, `partial[1]`의 실제 값은 `{4, 5, 0}`이다. 기존 예제처럼 같은 블록에서 `int arr[2][3]`를 두 번 선언하면 재정의 오류가 나므로 서로 다른 변수명을 써야 한다.

## 3. C의 함수 인자는 항상 값으로 전달된다

C에는 언어 차원의 참조 매개변수가 없다. 포인터를 넘길 때도 **주소를 담은 포인터 값의 복사본**이 매개변수에 들어간다. 그 복사된 포인터를 역참조하면 호출자 객체를 수정할 수 있다.

```c
#include <stdio.h>

static void add_five(int value, int *target)
{
    printf("inside before: value=%d, *target=%d\n", value, *target);
    value += 5;
    *target += 5;
    printf("inside after : value=%d, *target=%d\n", value, *target);
}

int main(void)
{
    int n = 10;
    int k = 20;

    printf("before: n=%d, k=%d\n", n, k);
    add_five(n, &k);
    printf("after : n=%d, k=%d\n", n, k);
    return 0;
}
```

실행 결과:

```text
before: n=10, k=20
inside before: value=10, *target=20
inside after : value=15, *target=25
after : n=10, k=25
```

`value`를 바꿔도 복사본만 변하므로 `n`은 10이다. `target` 역시 복사된 포인터지만 `*target`은 호출자의 `k`를 가리키므로 `k`는 25가 된다. 따라서 이 패턴은 “참조에 의한 호출”보다 **포인터 값을 전달해 가리키는 객체를 수정한다**고 표현하는 편이 정확하다.

## 4. 포인터 덧셈은 바이트가 아니라 원소 단위다

`p + 1`은 숫자 주소에 1을 더한다는 뜻이 아니라, `p`가 가리키는 배열의 **다음 원소**를 가리킨다는 뜻이다. 컴파일러가 가리키는 타입의 크기를 반영한다.

```c
int values[4] = {10, 20, 30, 40};
int *p = values;

printf("%d\n", *(p + 2));  // values[2], 결과 30
printf("%d\n", p[2]);      // 같은 식
```

포인터 산술은 같은 배열의 원소 또는 마지막 원소 바로 다음 위치까지만 정의된다. `values + 4`라는 포인터를 만들어 반복문의 종료 조건으로 비교할 수는 있지만, `*(values + 4)`처럼 역참조하면 정의되지 않은 동작이다.

## 5. 2차원 배열에서 포인터는 한 행씩 이동한다

{% raw %}
```c
#include <stdio.h>

int main(void)
{
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    int (*row)[3] = matrix;

    printf("row[1][2]=%d\n", row[1][2]);
    printf("*(*(row+1)+0)=%d\n", *(*(row + 1) + 0));
    return 0;
}
```
{% endraw %}

실행 결과:

```text
row[1][2]=6
*(*(row+1)+0)=4
```

| 식 | 해석 |
|---|---|
| `matrix` | 첫 행을 가리키는 `int (*)[3]`로 변환 |
| `row + 1` | 두 번째 행 `&matrix[1]`을 가리킴 |
| `*(row + 1)` | 두 번째 행인 `int[3]` |
| `*(*(row + 1) + 2)` | 두 번째 행의 세 번째 값 `6` |

`row`가 가리키는 한 원소의 타입은 `int[3]`이므로 `row + 1`은 `int` 하나가 아니라 세 개짜리 한 행을 건너뛴다.

## 6. 구조체 선언과 멤버 접근

```c
struct ExamScore {
    const char *subject;
    int score;
};

struct ExamScore item = {"자료구조", 95};
struct ExamScore *item_ptr = &item;

printf("%s %d\n", item.subject, item.score);
printf("%s %d\n", item_ptr->subject, item_ptr->score);
```

구조체 형식은 `struct 태그 { 멤버 선언; ... };`이다. 구조체 객체에는 `.`, 구조체를 가리키는 포인터에는 `->`를 사용한다.

## 7. 반드시 피해야 할 세 가지

```c
int *uninitialized;
// *uninitialized = 1;  // 초기화되지 않은 포인터 역참조: 정의되지 않은 동작

int a[3] = {1, 2, 3};
int *end = a + 3;       // 마지막 다음 위치를 만드는 것은 허용
// printf("%d", *end); // 마지막 다음 위치의 역참조: 정의되지 않은 동작
```

- 초기화하지 않은 포인터나 `NULL`을 역참조하지 않는다.
- 배열 범위를 벗어난 포인터를 만들거나 역참조하지 않는다.
- 지역 변수의 주소를 반환하지 않는다. 함수가 끝나면 그 객체의 수명이 끝난다.

## 직접 추적해 보기

다음 선언이 있을 때 값을 먼저 종이에 적고 실행 결과와 비교한다.

{% raw %}
```c
int a[2][3] = {{1, 2, 3}, {4, 5, 6}};
int (*p)[3] = a;
```
{% endraw %}

1. `p[0][2]`의 값은 무엇인가?
2. `*(*(p + 1) + 1)`의 값은 무엇인가?
3. `p + 1`은 `int` 몇 개를 건너뛰는가?

<details>
<summary>정답</summary>

1. `3`
2. `5`
3. 한 행의 원소 수인 `int` 3개

</details>

## 참고 자료

- [ISO C11 공개 위원회 초안 N1570](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) — 배열→포인터 변환 §6.3.2.1, 배열 첨자 §6.5.2.1, 함수 호출 §6.5.2.2, 포인터 산술 §6.5.6
- [SEI CERT C ARR30-C: 배열 범위를 벗어난 포인터와 첨자 금지](https://wiki.sei.cmu.edu/confluence/display/c/ARR30-C.%2BDo%2Bnot%2Bform%2Bor%2Buse%2Bout-of-bounds%2Bpointers%2Bor%2Barray%2Bsubscripts)
- [cppreference: C 배열 선언과 배열-포인터 변환](https://en.cppreference.com/w/c/language/array)
