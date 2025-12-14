---
layout: post
title: "Unity camera WorldToScreenPoint guide"
date: 2025-01-09 23:38:24 +0900
categories: 
tags: [Unity, Game Theory, C#]
---

# Unity Camera WorldToScreenPoint 가이드

WorldToScreenPoint는 3D 월드 좌표를 2D 스크린 좌표로 변환하는 메소드다. UI를 3D 오브젝트 위치에 맞출 때 쓴다!

## 기본 사용법

```csharp
public Vector3 Camera.WorldToScreenPoint(Vector3 position);
```

- **입력**: 월드 좌표 (Vector3)
- **출력**: 스크린 좌표 (Vector3)
  - x, y: 화면 픽셀 좌표
  - z: 카메라로부터의 거리 (0보다 작으면 카메라 뒤)

## 좌표계 이해

### 월드 좌표
- 유니티의 3D 공간 좌표
- 원점 (0,0,0) 기준
- 예: (5, 10, 0)

### 스크린 좌표
- 화면 픽셀 좌표
- 좌하단 (0, 0), 우상단 (Screen.width, Screen.height)
- 예: 1920x1080 화면에서 (960, 540) = 화면 중앙

## 기본 예시

```csharp
using UnityEngine;

public class WorldToScreenExample : MonoBehaviour
{
    public Camera mainCamera;
    public Transform targetObject;

    void Update()
    {
        Vector3 screenPos = mainCamera.WorldToScreenPoint(targetObject.position);
        Debug.Log($"스크린 좌표: {screenPos}");
    }
}
```

## 뷰포트 좌표 vs 스크린 좌표

- **뷰포트 좌표**: (0,0) ~ (1,1) 범위로 표현
- **스크린 좌표**: 픽셀 단위

메소드:
- `WorldToScreenPoint`: 월드 → 스크린
- `WorldToViewportPoint`: 월드 → 뷰포트

## 활용 예시

3D 오브젝트 위에 UI를 표시할 때 사용한다:

```csharp
using UnityEngine;
using UnityEngine.UI;

public class WorldUI : MonoBehaviour
{
    public Camera mainCamera;
    public Transform targetTransform;
    public RectTransform uiElement;

    void Update()
    {
        // 월드 좌표를 스크린 좌표로 변환
        Vector3 screenPos = mainCamera.WorldToScreenPoint(targetTransform.position);

        // 카메라 앞에 있을 때만 표시
        if (screenPos.z > 0)
        {
            uiElement.gameObject.SetActive(true);
            uiElement.position = screenPos;
        }
        else
        {
            uiElement.gameObject.SetActive(false);
        }
    }
}
```

## 실제 사용 예시

```csharp
private void LateUpdate()
{
    if (targetTransform == null)
    {
        Destroy(gameObject);
        return;
    }

    // 월드 좌표 → 스크린 좌표 변환
    Vector3 screenPosition = Camera.main.WorldToScreenPoint(targetTransform.position);

    // UI를 스크린 좌표 + distance 위치에 배치
    rectTransform.position = screenPosition + distance;
}
```

**LateUpdate 사용 이유**: 오브젝트 위치가 Update에서 갱신된 후 UI 위치를 최종적으로 맞추기 위함

## 정리

WorldToScreenPoint는 3D 오브젝트를 2D UI와 연결할 때 필수다. 체력 바, 퀘스트 마커, 조준선 등에 유용하게 쓸 수 있다!