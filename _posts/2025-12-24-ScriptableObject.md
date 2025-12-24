---
layout: post
title: "ScriptableObject와 암호화 저장 시스템"
date: 2025-12-24 19:38:00 +0900
categories: 
tags: "Unity", "Csharp"
---

## [Unity] 효율적인 게임 데이터 관리: ScriptableObject와 암호화 저장 시스템

게임을 만들다 보면 아이템, 퀘스트, 스킬 등 수많은 데이터를 관리해야 합니다. "아이템 이름은 무엇인지", "공격력은 얼마인지" 같은 **고정 데이터**와 "유저가 이 아이템을 가졌는지", "퀘스트를 깼는지" 같은 **변동 데이터**를 어떻게 나누고 저장해야 할까요?

오늘은 유니티 개발의 정석이라 불리는 **ScriptableObject(SO)**와 **JSON + AES 암호화 저장** 구조를 알아보겠습니다.

---

### 1. 설계의 핵심: "설계도"와 "상태도"를 분리하라

가장 먼저 이해해야 할 것은 **원본 데이터**와 **세이브 데이터**를 분리하는 것입니다.

* **ScriptableObject (원본/설계도):** 모든 아이템의 기본 정보(ID, 이름, 설명, 프리팹 등)를 담습니다. 게임 중에 값이 변하지 않는 '읽기 전용' 데이터입니다.
* **Save Data (상태도):** 특정 유저가 가진 아이템의 시리얼 번호, 수량, 퀘스트 진행도 등을 담습니다. 이 데이터만 파일로 저장됩니다.

---

### 2. 왜 ScriptableObject(SO)를 써야 할까?

많은 입문자가 리스트를 스크립트에 직접 하드코딩하거나 엑셀만 고집하곤 합니다. 하지만 SO를 쓰면 다음과 같은 강력한 장점이 있습니다.

1. **메모리 최적화:** 1,000마리의 몬스터가 같은 SO를 참조하면, 데이터는 메모리에 단 1개만 올라갑니다.
2. **워크플로우 개선:** 코드 수정 없이 유니티 에디터에서 클릭 몇 번으로 새 아이템을 생성하고 수정할 수 있습니다.
3. **데이터의 구조화:** 아이템 리스트나 퀘스트 리스트를 하나의 '데이터베이스' 파일처럼 관리하기 매우 용이합니다.

---

### 3. 데이터 저장, PlayerPrefs로 충분할까?

결론부터 말씀드리면 **"아니오"**입니다. `PlayerPrefs`는 간단한 설정값 저장용이지, 복잡한 인벤토리나 퀘스트 데이터를 담기엔 부적합합니다.

* **보안:** 누구나 레지스트리를 열어 값을 수정할 수 있습니다.
* **구조:** 리스트나 딕셔너리 같은 복잡한 구조를 저장하기 어렵습니다.

그래서 우리는 **JSON** 형식을 사용합니다. JSON은 객체 구조를 문자열로 바꿔주기 때문에 복잡한 리스트도 한 번에 저장할 수 있습니다.

---

### 4. 보안의 완성: AES 암호화

로컬 파일(`.json`)로 저장하면 유저가 메모장으로 열어 내용을 수정할 위험이 있습니다. 이를 방지하기 위해 **AES(Advanced Encryption Standard)** 양방향 암호화를 사용합니다.

#### 암호화 적용 흐름:

1. **Save:** 세이브 데이터 객체 → JSON 변환 → **AES 암호화** → 파일 저장
2. **Load:** 파일 읽기 → **AES 복호화** → JSON 변환 → 데이터 복구

이렇게 하면 유저가 파일을 열어도 암호화된 외계어만 보이게 되어 데이터 조작을 원천 봉쇄할 수 있습니다.

---

### 5. 실무에 바로 쓰는 구현 예시

#### [데이터 구조 예시]

```csharp
// 원본 데이터 (ScriptableObject)
public class QuestData : ScriptableObject {
    public int QuestID;
    public string Title;
    public int TargetCount;
}

// 유저 저장 데이터 (일반 Class)
[Serializable]
public class UserQuestState {
    public int QuestID;
    public int CurrentCount;
    public bool IsCompleted;
}

```

#### [암호화 및 저장 로직]

`System.Security.Cryptography`를 사용하여 데이터를 안전하게 보호합니다.

```csharp
public static class SaveSystem {
    private static readonly string Key = "MySecretKey1234567890123456789012"; // 32바이트

    public static void Save(SaveData data) {
        string json = JsonUtility.ToJson(data);
        string encrypted = Encrypt(json); // AES 암호화 함수
        File.WriteAllText(Path.Combine(Application.persistentDataPath, "save.dat"), encrypted);
    }
}

```

---

### 요약 및 결론

1. **아이템/퀘스트 원본**은 `ScriptableObject` 리스트로 관리하여 메모리를 아끼고 에디터 편의성을 높이세요.
2. **유저의 진행 상태**는 필요한 값(ID, 수량 등)만 뽑아 별도의 클래스로 관리하세요.
3. 세이브 파일은 **JSON**으로 변환하고, **AES 암호화**를 거쳐 `persistentDataPath`에 저장하는 것이 가장 안전하고 대중적인 방법입니다.

이제 여러분의 프로젝트에 이 구조를 도입해 보세요. 데이터 관리가 훨씬 깔끔해지고 보안까지 챙긴 전문적인 게임 개발이 가능해질 것입니다!

---

**도움이 되셨나요?** 다음 포스팅에서는 실제로 AES 암호화 클래스를 구현하는 상세 코드를 공유해 드릴게요!

> **Tip:** 암호화 키는 절대 코드에 평문으로 노출하지 않도록 주의하세요! (실제 배포 시에는 더 고도화된 키 관리 기법이 필요합니다.)

---

블로그 글 형태로 정리해 드렸는데 마음에 드시나요?
내용 중에 **실제 암호화 함수 내부 코드(C#)**나 **ID를 통해 SO 데이터를 찾는 매니저 클래스 구현법**이 더 필요하시면 알려주세요! 바로 작성해 드릴 수 있습니다.
