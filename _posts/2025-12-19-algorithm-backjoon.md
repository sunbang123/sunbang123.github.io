---
layout: post
title: "Algorithm backjoon"
date: 2025-12-19 15:17:23 +0900
categories: 
tags: Algorithm
---

중위 표기식이 주어졌을 때 후위 표기식으로 고치는 프로그램을 작성하시오


링크: https://www.acmicpc.net/problem/1918

---

중위 표기식을 후위 표기식으로 바꾸는 알고리즘을 완성시켰다. 스택과 switch case문을 활용했습니다.

```{.cpp}
#include <iostream>
#include <stack>
#include <string>
using namespace std;

            // &붙여서 주소값에 바로 접근
void endFormula(string& _result, stack<char>& _operator)
{
    while(!_operator.empty() && _operator.top() != '(')
    {
        _result += _operator.top();
        _operator.pop();
    }
    if(!_operator.empty() && _operator.top() == '(')
        _operator.pop();
    return;
}

void printOperate(string& _result, stack<char>& _operator)
{
    while(!_operator.empty())
    {
        if(_operator.top() != '(' && _operator.top() != ')')
            _result += _operator.top();
        _operator.pop();
    }
}

int precedence(char op) {
    if (op == '+' || op == '-') return 1;
    if (op == '*' || op == '/') return 2;
    return 0;
}

int main()
{
    string formula, result;
    stack<char> s_operator;

    cin >> formula;

    //size_t는 인덱스용으로 많이쓰임. 메모리 크기가 작다.
    for(size_t i = 0; i < formula.length(); ++i)
    {
        char c = formula[i];
        switch(c)
        {
            case '(':
                s_operator.push(c);
                break;

            case ')':
                endFormula(result, s_operator);
                break;

            case '+': case '-': case '*': case '/':
                while(!s_operator.empty() && s_operator.top() != '('
                      && precedence(s_operator.top()) >= precedence(c))
                {
                    result += s_operator.top();
                    s_operator.pop();
                }
                s_operator.push(c);
                break;

            default:
                result += c;
                break;
        }
    }

    printOperate(result, s_operator);

    cout << result << endl;
    return 0;
}
```

반복문으로 문자열은 1번만 순회했다.
switch case문으로 제작할때는 연산자 우선순위대로 두었다.

처음에는 괄호를 어떻게 처리하나 고민했는데 일단, 문자와 연산자들을 분리시켜놓고 하나씩 스택에서 빼내는데 닫힌 중괄호를 만나면 모든 연산자를 반환하고(단, 열린 중괄호를 만나기 전까지!) 
우선순위를 구하는 방식은 고민고민하다가 검색했다. 
precedence 함수를 만들어서 + - * / 케이스 내부에서 비교했다.
괄호연산자가 비교대상에 없고, 스택이 비어있지 않고, 현재 연산자가 이전 연산자보다 우선순위가 더 크면 result로 바로 넣는다. 이 조건에 충족하지 않으면 스택에 담는다.
우선순위가 
마지막에 printOperate로 괄호를 배제시키고 result에 담아서 출력했다.
