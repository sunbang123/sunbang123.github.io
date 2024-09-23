---
layout: post
title: "Computer architecture(1) - register"
date: 2024-09-23 18:10:54 +0900
categories: 
tags: 
---

# 핵심 레지스터

### AR (Address Register)
메모리 주소를 저장하는 레지스터입니다. 명령어나 데이터의 위치를 가리키며, 메모리에서 데이터를 읽거나 쓰는 과정에서 사용됩니다.

### DR (Data Register)
데이터를 임시로 저장하는 레지스터입니다. 메모리에서 읽은 데이터를 저장하거나 연산 결과를 일시적으로 보관하는 데 사용됩니다.

### IR (Instruction Register)
현재 실행 중인 명령어를 저장하는 레지스터입니다. CPU가 메모리에서 명령어를 가져오면, 이 명령어는 IR에 저장되고 해석됩니다.

### PC (Program Counter)
다음에 실행될 명령어의 주소를 가리키는 레지스터입니다. 프로그램 실행 흐름을 제어하는 역할을 하며, 명령어가 실행될 때마다 PC는 자동으로 증가하여 다음 명령어를 가리킵니다.

> 이 레지스터들은 CPU 내부에서 명령어를 가져오고, 해석하고, 실행하는 과정에서 핵심적인 역할을 합니다.

---

# Main Registers

### AR (Address Register)
This register stores memory addresses. It is used to point to the location of data or instructions in memory, facilitating the process of reading or writing data.

### DR (Data Register)
The Data Register temporarily holds data. It can store data read from memory or temporarily hold the results of computations.

### IR (Instruction Register)
This register holds the instruction currently being executed. When the CPU fetches an instruction from memory, it is stored in the IR for decoding and execution.

### PC (Program Counter)
The Program Counter keeps track of the address of the next instruction to be executed. It controls the flow of program execution by automatically incrementing to point to the next instruction as each one is executed.

> These registers play crucial roles in the CPU's process of fetching, decoding, and executing instructions.