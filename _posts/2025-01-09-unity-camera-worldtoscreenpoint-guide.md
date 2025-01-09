---
layout: post
title: "Unity camera WorldToScreenPoint guide"
date: 2025-01-09 23:38:24 +0900
categories: [Unity, Game Theory, C#]
tags: 
---

# Unity Camera WorldToScreenPoint 가이드

## Camera.WorldToScreenPoint 메소드 개요

Camera.WorldToScreenPoint는 월드 좌표(World Position)를 스크린 좌표(Screen Position)로 변환하는 유니티의 메소드입니다. 이는 3D 월드 공간에 있는 특정 지점(예: 게임 오브젝트의 위치)을 카메라의 뷰포트를 기준으로 2D 스크린 공간에 대응하는 좌표로 변환할 때 사용됩니다.

### 메소드 시그니처

```csharp
public Vector3 Camera.WorldToScreenPoint(Vector3 position);
```

* **매개변수 position**: 변환할 3D 월드 좌표 (Vector3 타입)
* **반환값**: 2D 스크린 좌표 (Vector3)
  * x, y: 스크린 상의 픽셀 좌표
  * z: 해당 지점까지의 카메라로부터 깊이(거리)

## 좌표계 이해하기

### 월드 좌표(World Coordinates)

* 유니티의 월드 공간(World Space)에서의 위치를 나타냄
* 기준은 글로벌 원점(0,0,0)이며 모든 게임 오브젝트는 이 기준을 바탕으로 위치가 결정됨
* 예: (5, 10, 0)이라는 좌표는 월드 공간에서 (x:5, y:10, z:0) 지점을 나타냄

### 스크린 좌표(Screen Coordinates)

* 게임 화면 상의 픽셀 위치를 기준으로 정의
* 좌측 하단 (0, 0), 우측 상단은 화면의 해상도에 따라 (Screen.width, Screen.height)
* 예: 해상도가 1920x1080인 화면에서 (960, 540)은 화면의 정중앙을 의미

## 기본 사용 예시

```csharp
using UnityEngine;

public class WorldToScreenExample : MonoBehaviour
{
    public Camera mainCamera;
    public Transform targetObject;

    void Update()
    {
        // 월드 좌표에서 스크린 좌표로 변환
        Vector3 screenPos = mainCamera.WorldToScreenPoint(targetObject.position);

        Debug.Log($"스크린 좌표: {screenPos}");
    }
}
```

* 이 스크립트는 targetObject의 월드 좌표를 실시간으로 스크린 좌표로 변환하여 출력
* 스크린 좌표는 해상도에 따라 대략 (Screen.width / 2, Screen.height / 2)에 가까운 값으로 출력

## 보충 설명

* 반환된 Vector3의 z값은 카메라로부터 월드 좌표까지의 거리를 나타내며, 값이 0보다 작으면 해당 지점이 카메라 뒤에 있다는 의미
* UI 요소를 특정 월드 위치에 맞추고 싶을 때 주로 사용됨

### 뷰포트 좌표와 스크린 좌표의 차이

* **뷰포트 좌표(Viewport Coordinates)**: 화면 전체를 (0,0) ~ (1,1) 범위로 표현한 좌표
* **스크린 좌표(Screen Coordinates)**: 픽셀 단위로 표현한 좌표

좌표 변환 메소드:
* Camera.WorldToScreenPoint = 월드좌표 → 스크린좌표로 변환
* Camera.WorldToViewportPoint = 월드좌표 → 뷰포트좌표로 변환

## 실전 활용 예시

### 1. 적의 체력 바 표시하기

#### 상황
* 3D 슈팅 게임에서 플레이어가 적을 조준할 때 적의 머리 위에 체력바 표시
* 적은 월드 공간에 존재하지만 체력 바는 2D UI 요소이므로 스크린 좌표 기준으로 표시

#### 구현 코드

```csharp
using UnityEngine;
using UnityEngine.UI;

public class EnemyHealthBar : MonoBehaviour
{
    public Camera mainCamera;
    public Transform enemyTransform;
    public RectTransform healthBarUI;

    void Update()
    {
        // 적의 월드 좌표를 스크린 좌표로 변환
        Vector3 screenPos = mainCamera.WorldToScreenPoint(enemyTransform.position + Vector3.up * 2);

        // 적이 카메라의 앞에 있는 경우에만 체력 바 표시
        if (screenPos.z > 0)
        {
            healthBarUI.gameObject.SetActive(true);
            healthBarUI.position = screenPos; // 체력 바를 스크린 좌표에 배치
        }
        else
        {
            healthBarUI.gameObject.SetActive(false); // 적이 카메라 뒤에 있을 경우 숨김
        }
    }
}
```

### 2. 퀘스트 마커 표시하기

#### 상황
* RPG 게임에서 플레이어가 맵을 탐험할 때 중요한 퀘스트 목표 지점을 화면에 아이콘으로 표시
* 퀘스트 목표는 3D 월드 공간에 위치하지만 플레이어는 항상 2D 화면상의 위치로 확인 가능해야 함

#### 구현 코드

```csharp
using UnityEngine;
using UnityEngine.UI;

public class QuestMarker : MonoBehaviour
{
    public Camera mainCamera;
    public Transform questTarget;
    public RectTransform questMarkerUI;
    public float screenEdgeBuffer = 50f; // 가장자리에서 떨어진 거리

    void Update()
    {
        // 퀘스트 목표의 월드 좌표를 스크린 좌표로 변환
        Vector3 screenPos = mainCamera.WorldToScreenPoint(questTarget.position);

        // 목표가 카메라 앞에 있는 경우
        if (screenPos.z > 0)
        {
            screenPos.x = Mathf.Clamp(screenPos.x, screenEdgeBuffer, Screen.width - screenEdgeBuffer);
            screenPos.y = Mathf.Clamp(screenPos.y, screenEdgeBuffer, Screen.height - screenEdgeBuffer);

            questMarkerUI.gameObject.SetActive(true);
            questMarkerUI.position = screenPos; // 아이콘을 스크린 좌표에 배치
        }
        else
        {
            questMarkerUI.gameObject.SetActive(false); // 카메라 뒤에 있으면 숨김
        }
    }
}
```

### 3. MOBA 게임에서의 활용 (리그 오브 레전드 예시)

#### 스킬 범위 미리보기 구현

```csharp
using UnityEngine;

public class SkillRangeIndicator : MonoBehaviour
{
    public Camera mainCamera;
    public Transform skillTarget; // 스킬 범위의 목표 지점
    public RectTransform skillRangeUI; // 스킬 범위 미리보기 UI

    void Update()
    {
        // 스킬 목표 지점을 월드 좌표에서 스크린 좌표로 변환
        Vector3 screenPos = mainCamera.WorldToScreenPoint(skillTarget.position);

        if (screenPos.z > 0) // 카메라 앞에 있는 경우에만 표시
        {
            skillRangeUI.gameObject.SetActive(true);
            skillRangeUI.position = screenPos;
        }
        else
        {
            skillRangeUI.gameObject.SetActive(false);
        }
    }
}
```

## 실제 구현 예시

```csharp
private void LateUpdate()
{
    // 화면에 target이 보이지 않으면 UI 삭제
    if (targetTransform == null)
    {
        Destroy(gameObject);
        return;
    }

    // 오브젝트의 월드 좌표를 기준으로 화면에서의 좌표 값을 구함
    Vector3 screenPosition = Camera.main.WorldToScreenPoint(targetTransform.position);

    // 화면내에서 좌표 + distance만큼 떨어진 위치를 UI의 위치로 설정
    rectTransform.position = screenPosition + distance;
}
```

### 코드 설명

* **LateUpdate 사용 이유**: 오브젝트의 위치가 Update에서 갱신된 후 UI의 위치도 최종적으로 맞추기 위함
* **screenPosition**: 대상 오브젝트가 화면에서 어느 위치에 있어야 하는지 픽셀 좌표로 저장
* **rectTransform.position**: UI를 대상 오브젝트의 스크린 좌표에서 distance만큼 떨어진 위치에 배치

## 결론

Camera.WorldToScreenPoint는 게임에서 3D 월드 공간의 오브젝트를 2D 화면 요소(UI, 아이콘 등)와 동기화할 때 필수적인 메소드입니다. 체력 바, 퀘스트 마커, 조준선 등 많은 UI 요소를 월드 오브젝트에 맞추어 표시할 때 유용하게 사용됩니다. 3D 월드에 존재하지만 2D로 보여줘야 하는 요소가 있다면 이 메소드를 적극 활용하시기 바랍니다.