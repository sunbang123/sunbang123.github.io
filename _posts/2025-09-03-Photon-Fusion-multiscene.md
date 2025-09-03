---
layout: post
title: "Photon Fusion 2 멀티씬 네트워킹 완전 가이드"
date: 2025-08-03 13:46:16 +0900
categories: 
tags: ["Unity", "C#", "SDK"]
---
# Photon Fusion 2 멀티씬 네트워킹 완전 가이드

## 개요

본 문서는 Photon Fusion 2에서 공유모드(Shared Mode)와 멀티씬 로딩(Scene.LoadSceneMode.Additive)을 활용한 네트워킹 구현에 대한 완전한 가이드를 제공합니다. 방 생성부터 통신, 게임 결과 반영까지의 전체 프로세스를 다룹니다.

---

## 1. Photon Fusion 2 아키텍처 개요

### 1.1 Network Runner와 API 구조

Photon Fusion 2는 **NetworkRunner**를 핵심 컴포넌트로 사용하여 네트워크 시뮬레이션을 실행합니다. NetworkRunner는 Fusion API를 통해 다음과 같은 역할을 수행합니다:

- 네트워크 세션 생성 및 관리
- 틱 기반 시뮬레이션 실행
- 클라이언트 연결 상태 관리
- Unity 씬과의 동기화 처리

```csharp
// 기본 NetworkRunner 설정
private NetworkRunner _runner;

async void InitializeNetworking()
{
    _runner = gameObject.AddComponent<NetworkRunner>();
    _runner.ProvideInput = true;
    
    // NetworkRunner가 INetworkRunnerCallbacks를 자동으로 감지
    var result = await _runner.StartGame(new StartGameArgs()
    {
        GameMode = GameMode.Shared,
        SessionName = "MultiSceneRoom",
        Scene = SceneRef.FromIndex(0),
        SceneManager = gameObject.AddComponent<NetworkSceneManagerDefault>()
    });
}
```

### 1.2 데이터 흐름 메커니즘

1. **NetworkRunner** → Fusion API를 통해 네트워크 이벤트 처리
2. **네트워크 상태 동기화** → Unity GameObject와 실시간 연동
3. **NetworkBehaviour** → 네트워크 데이터 송수신 담당

---

## 2. 개발환경 설정

### 2.1 시스템 요구사항

- **Unity 버전**: Unity 2022.3 LTS 이상 권장
- **.NET 지원**: .NET Standard 2.1
- **Photon AppId**: Photon 대시보드에서 발급 필요

### 2.2 프로젝트 초기 설정

```csharp
[CreateAssetMenu(menuName = "Fusion/App Settings")]
public class MyAppSettings : ScriptableObject 
{
    [Header("Photon Configuration")]
    public string AppId;
    public string Region = "asia";
    
    [Header("Game Settings")]
    public int MaxPlayers = 8;
    public float TickRate = 60f;
}
```

---

## 3. 기본 모듈 구성

### 3.1 NetworkBehaviour 구현

```csharp
public class PlayerController : NetworkBehaviour
{
    [Networked] public Vector3 NetworkPosition { get; set; }
    [Networked] public float Health { get; set; }
    [Networked] public NetworkButtons ButtonsPrevious { get; set; }
    
    public override void FixedUpdateNetwork()
    {
        // 네트워크 틱마다 실행되는 로직
        if (GetInput<NetworkInputData>(out var input))
        {
            ProcessMovement(input);
            ProcessActions(input);
        }
    }
    
    private void ProcessMovement(NetworkInputData input)
    {
        var movement = input.MovementInput * Runner.DeltaTime * 5f;
        NetworkPosition += new Vector3(movement.x, 0, movement.y);
    }
}
```

### 3.2 입력 시스템 구성

```csharp
public struct NetworkInputData : INetworkInput
{
    public Vector2 MovementInput;
    public NetworkButtons Buttons;
    public float MouseX;
    public float MouseY;
}

public class InputHandler : MonoBehaviour, INetworkBehaviour
{
    public void OnInput(NetworkRunner runner, NetworkInputData input)
    {
        input.MovementInput = new Vector2(
            Input.GetAxis("Horizontal"),
            Input.GetAxis("Vertical")
        );
        
        input.Buttons.Set(InputButtons.Fire, Input.GetKey(KeyCode.Space));
        input.Buttons.Set(InputButtons.Jump, Input.GetKey(KeyCode.LeftShift));
    }
}
```

---

## 4. NetworkSceneManager 생성 및 구현

> **참고 문서**: [Fusion 2 - Setting Up A Scene | Photon Engine](https://doc.photonengine.com/fusion/current/tutorials/host-mode-basics/2-setting-up-a-scene)

### 4.1 기본 NetworkSceneManagerDefault 사용

공식 문서에 따르면, `StartGame` 메서드에서 `gameObject.AddComponent<NetworkSceneManagerDefault>()`를 사용합니다:

```csharp
public class BasicSpawner : MonoBehaviour, INetworkRunnerCallbacks
{
    private NetworkRunner _runner;

    async void StartGame()
    {
        _runner = gameObject.AddComponent<NetworkRunner>();
        _runner.ProvideInput = true;

        await _runner.StartGame(new StartGameArgs()
        {
            GameMode = GameMode.Host,
            SessionName = "TestRoom",
            Scene = SceneRef.FromIndex(0),
            // NetworkSceneManagerDefault 컴포넌트 추가
            SceneManager = gameObject.AddComponent<NetworkSceneManagerDefault>()
        });
    }
}
```

### 4.2 커스텀 NetworkSceneManager 구현

> **참고 문서**: [Fusion 2 - Scene Loading | Photon Engine](https://doc.photonengine.com/fusion/current/manual/scene-loading)

NetworkSceneManagerDefault 구현에서는 Version 필드가 카운터로 작동하여 씬이 로드되거나 언로드될 때마다 증가합니다:

```csharp
public class CustomNetworkSceneManager : NetworkSceneManagerDefault
{
    [Header("Multi-Scene Configuration")]
    public List<SceneReference> additiveScenes = new List<SceneReference>();
    
    public override Task LoadSceneAsync(NetworkSceneInfo sceneInfo, 
                                      LoadSceneParameters sceneParameters, 
                                      bool clientSynchronization = true)
    {
        Debug.Log($"[SceneManager] Loading scene: {sceneInfo.Scene}");
        
        // 멀티씬을 위한 커스텀 로직
        if (sceneParameters.loadSceneMode == LoadSceneMode.Additive)
        {
            return LoadAdditiveSceneWithNetworking(sceneInfo, sceneParameters);
        }
        
        return base.LoadSceneAsync(sceneInfo, sceneParameters, clientSynchronization);
    }
    
    private async Task LoadAdditiveSceneWithNetworking(NetworkSceneInfo sceneInfo, 
                                                      LoadSceneParameters parameters)
    {
        // Unity SceneManager로 additive 로드
        var operation = SceneManager.LoadSceneAsync(sceneInfo.Scene.AssetGuidString, 
                                                   LoadSceneMode.Additive);
        
        // 로딩 진행률 모니터링
        while (!operation.isDone)
        {
            Debug.Log($"Scene loading progress: {operation.progress * 100f}%");
            await Task.Yield();
        }
        
        // 로드된 씬의 NetworkObject들을 Runner에 등록
        var loadedScene = SceneManager.GetSceneAt(SceneManager.sceneCount - 1);
        await RegisterSceneNetworkObjects(loadedScene);
        
        Debug.Log($"[SceneManager] Scene {sceneInfo.Scene} loaded successfully");
    }
    
    private async Task RegisterSceneNetworkObjects(Scene scene)
    {
        var networkObjects = new List<NetworkObject>();
        
        // 씬의 모든 루트 오브젝트에서 NetworkObject 수집
        foreach (GameObject rootObj in scene.GetRootGameObjects())
        {
            networkObjects.AddRange(rootObj.GetComponentsInChildren<NetworkObject>());
        }
        
        // NetworkRunner에 씬 오브젝트들 등록
        if (networkObjects.Count > 0)
        {
            Runner.RegisterSceneObjects(networkObjects.ToArray());
            Debug.Log($"[SceneManager] Registered {networkObjects.Count} NetworkObjects");
        }
    }
}
```

---

## 5. 공유모드 멀티씬 네트워킹 구현

### 5.1 방 생성 및 참여 프로세스

```csharp
public class MultiSceneGameManager : MonoBehaviour, INetworkRunnerCallbacks
{
    [Header("Scene Configuration")]
    [SerializeField] private SceneReference baseScene;
    [SerializeField] private SceneReference uiScene;
    [SerializeField] private SceneReference gameplayScene;
    [SerializeField] private SceneReference environmentScene;
    
    private NetworkRunner _runner;
    private CustomNetworkSceneManager _sceneManager;
    
    async void Start()
    {
        await InitializeSharedMode();
    }
    
    async Task InitializeSharedMode()
    {
        // 커스텀 SceneManager 생성
        _sceneManager = gameObject.AddComponent<CustomNetworkSceneManager>();
        _runner = gameObject.AddComponent<NetworkRunner>();

        var startGameArgs = new StartGameArgs()
        {
            GameMode = GameMode.Shared,
            SessionName = "MultiSceneRoom",
            Scene = SceneRef.FromIndex(0), // 기본 씬
            SceneManager = _sceneManager,
            PlayerCount = 8
        };

        var result = await _runner.StartGame(startGameArgs);
        
        if (result.Ok)
        {
            Debug.Log("[GameManager] Game session started successfully!");
            
            // Scene Authority를 가진 클라이언트만 추가 씬 로드
            if (_runner.HasStateAuthority)
            {
                await LoadAdditionalScenes();
            }
        }
        else
        {
            Debug.LogError($"[GameManager] Failed to start game: {result.ShutdownReason}");
        }
    }
}
```

### 5.2 멀티씬 로딩 및 동기화

```csharp
public class MultiSceneNetworkManager : NetworkBehaviour
{
    [Networked] public NetworkString<_32> CurrentGameScene { get; set; }
    [Networked] public int LoadedSceneCount { get; set; }
    [Networked] public GamePhase CurrentPhase { get; set; }
    
    public async Task LoadAdditionalScenes()
    {
        if (!Object.HasStateAuthority) return;
        
        CurrentPhase = GamePhase.LoadingScenes;
        
        try
        {
            // UI 씬 로드
            await LoadSceneAdditive("UIScene", 1);
            
            // 게임플레이 씬 로드  
            await LoadSceneAdditive("GameplayScene", 2);
            
            // 환경 씬 로드
            await LoadSceneAdditive("EnvironmentScene", 3);
            
            // 모든 씬 로드 완료 알림
            RPC_NotifyAllScenesLoaded();
        }
        catch (Exception ex)
        {
            Debug.LogError($"[SceneManager] Error loading scenes: {ex.Message}");
        }
    }
    
    private async Task LoadSceneAdditive(string sceneName, int sceneIndex)
    {
        Debug.Log($"[SceneManager] Loading {sceneName}...");
        
        await SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Additive);
        LoadedSceneCount++;
        
        // 로드된 씬의 NetworkObject들을 등록
        var scene = SceneManager.GetSceneByName(sceneName);
        RegisterSceneNetworkObjects(scene);
        
        RPC_NotifySceneLoaded(sceneName, sceneIndex);
    }
    
    [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
    void RPC_NotifySceneLoaded(NetworkString<_32> sceneName, int sceneIndex)
    {
        Debug.Log($"[Network] Scene {sceneName} loaded on all clients");
        
        // 클라이언트별 씬 로딩 후 처리
        OnSceneLoadedCallback?.Invoke(sceneName.ToString(), sceneIndex);
    }
    
    [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
    void RPC_NotifyAllScenesLoaded()
    {
        CurrentPhase = GamePhase.Ready;
        Debug.Log("[Network] All scenes loaded successfully!");
        
        // 게임 시작 준비 완료
        OnAllScenesLoadedCallback?.Invoke();
    }
    
    // 콜백 이벤트들
    public System.Action<string, int> OnSceneLoadedCallback;
    public System.Action OnAllScenesLoadedCallback;
}

public enum GamePhase
{
    Initializing,
    LoadingScenes,
    Ready,
    Playing,
    GameEnded
}
```

---

## 6. 씬 간 통신 메커니즘

### 6.1 NetworkObject 관리

```csharp
public class SceneSpecificNetworkObject : NetworkBehaviour
{
    [Networked] public SceneRef OwnerScene { get; set; }
    [Networked] public NetworkString<_16> SceneName { get; set; }
    
    public override void Spawned()
    {
        // 해당 오브젝트가 속한 씬 정보 저장
        var currentScene = gameObject.scene;
        OwnerScene = SceneRef.FromIndex(currentScene.buildIndex);
        SceneName = currentScene.name;
        
        // 씬별 오브젝트 분류 및 등록
        RegisterToSceneManager();
        
        Debug.Log($"[NetworkObject] Spawned in scene: {SceneName}");
    }
    
    private void RegisterToSceneManager()
    {
        var sceneManager = FindObjectOfType<MultiSceneNetworkManager>();
        sceneManager?.RegisterSceneObject(this);
    }
    
    public override void Despawned(NetworkRunner runner, bool hasState)
    {
        Debug.Log($"[NetworkObject] Despawned from scene: {SceneName}");
        base.Despawned(runner, hasState);
    }
}
```

### 6.2 씬 간 데이터 공유

```csharp
public class CrossSceneDataManager : NetworkBehaviour
{
    [Networked, Capacity(10)] 
    public NetworkDictionary<int, PlayerData> PlayersData { get; }
    
    [Networked, Capacity(5)]
    public NetworkArray<SceneGameState> ScenesState { get; }
    
    [Networked] public GameStats GlobalGameStats { get; set; }
    
    // UI씬에서 게임씬 데이터 접근
    public void UpdateUIFromGameScene(int playerId, float health, int score)
    {
        if (!Object.HasStateAuthority) return;
        
        var playerData = PlayersData.Get(playerId, new PlayerData());
        playerData.Health = health;
        playerData.Score = score;
        playerData.LastUpdated = Runner.Tick;
        
        PlayersData.Set(playerId, playerData);
        
        // UI 업데이트 RPC 호출
        RPC_UpdatePlayerUI(playerId, health, score);
    }
    
    [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
    void RPC_UpdatePlayerUI(int playerId, float health, int score)
    {
        // UI씬의 플레이어 정보 패널 업데이트
        var playerUI = FindObjectOfType<PlayerUIManager>();
        playerUI?.UpdatePlayerInfo(playerId, health, score);
    }
    
    // 게임씬에서 환경씬 데이터 접근
    public void UpdateEnvironmentFromGame(Vector3 explosionPos, float radius)
    {
        if (!Object.HasStateAuthority) return;
        
        RPC_TriggerEnvironmentEffect(explosionPos, radius);
    }
    
    [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
    void RPC_TriggerEnvironmentEffect(Vector3 position, float radius)
    {
        // 환경씬의 이펙트 매니저 호출
        var envManager = FindObjectOfType<EnvironmentEffectManager>();
        envManager?.TriggerExplosion(position, radius);
    }
}

[System.Serializable]
public struct PlayerData : INetworkStruct
{
    public float Health;
    public int Score;
    public Vector3 Position;
    public Tick LastUpdated;
}

[System.Serializable]
public struct SceneGameState : INetworkStruct
{
    public NetworkString<_16> SceneName;
    public bool IsActive;
    public int ObjectCount;
    public float StateValue;
}

[System.Serializable]
public struct GameStats : INetworkStruct
{
    public int TotalKills;
    public int TotalDeaths;
    public float GameDuration;
    public Tick GameStartTick;
}
```

---

## 7. 게임 결과 처리 및 반영

### 7.1 게임 결과 관리 시스템

```csharp
public class GameResultManager : NetworkBehaviour
{
    [Networked] public GamePhase CurrentPhase { get; set; }
    [Networked] public NetworkString<_32> WinnerName { get; set; }
    [Networked] public int WinnerScore { get; set; }
    [Networked] public Tick GameEndTick { get; set; }
    
    [Header("Game Configuration")]
    [SerializeField] private int targetScore = 100;
    [SerializeField] private float gameDuration = 300f; // 5분
    
    private CrossSceneDataManager _dataManager;
    
    public override void Spawned()
    {
        _dataManager = FindObjectOfType<CrossSceneDataManager>();
        
        // 게임 상태 모니터링 시작
        if (Object.HasStateAuthority)
        {
            StartCoroutine(MonitorGameConditions());
        }
    }
    
    private IEnumerator MonitorGameConditions()
    {
        while (CurrentPhase == GamePhase.Playing)
        {
            // 승리 조건 체크
            CheckWinConditions();
            
            // 시간 초과 체크
            CheckTimeLimit();
            
            yield return new WaitForSeconds(1f);
        }
    }
    
    private void CheckWinConditions()
    {
        var playersData = _dataManager.PlayersData;
        
        foreach (var kvp in playersData)
        {
            if (kvp.Value.Score >= targetScore)
            {
                EndGame(kvp.Key, kvp.Value.Score, "Score Limit Reached");
                return;
            }
        }
    }
    
    private void CheckTimeLimit()
    {
        var gameStats = _dataManager.GlobalGameStats;
        var elapsedTime = (Runner.Tick - gameStats.GameStartTick) * Runner.DeltaTime;
        
        if (elapsedTime >= gameDuration)
        {
            // 최고 점수 플레이어 찾기
            var topPlayer = FindTopScorePlayer();
            EndGame(topPlayer.Key, topPlayer.Value, "Time Limit Reached");
        }
    }
    
    private KeyValuePair<int, int> FindTopScorePlayer()
    {
        var playersData = _dataManager.PlayersData;
        var topScore = -1;
        var topPlayerId = -1;
        
        foreach (var kvp in playersData)
        {
            if (kvp.Value.Score > topScore)
            {
                topScore = kvp.Value.Score;
                topPlayerId = kvp.Key;
            }
        }
        
        return new KeyValuePair<int, int>(topPlayerId, topScore);
    }
    
    public void EndGame(int winnerId, int finalScore, string reason)
    {
        if (!Object.HasStateAuthority) return;
        
        CurrentPhase = GamePhase.GameEnded;
        GameEndTick = Runner.Tick;
        
        // 승자 정보 설정
        var winnerName = GetPlayerName(winnerId);
        WinnerName = winnerName;
        WinnerScore = finalScore;
        
        Debug.Log($"[GameResult] Game ended: {reason} - Winner: {winnerName} (Score: {finalScore})");
        
        // 게임 결과 RPC 전송
        RPC_GameEnded(winnerId, finalScore, reason);
    }
    
    [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
    void RPC_GameEnded(int winnerId, int finalScore, NetworkString<_64> reason)
    {
        var winnerName = GetPlayerName(winnerId);
        
        Debug.Log($"[Network] Game ended - Winner: {winnerName}, Score: {finalScore}, Reason: {reason}");
        
        // UI씬의 결과창 업데이트
        var resultUI = FindObjectOfType<ResultUI>();
        resultUI?.ShowResults(winnerId, winnerName, finalScore, reason.ToString());
        
        // 게임플레이 씬의 오브젝트들 정리
        StartCoroutine(CleanupAndPrepareNext());
    }
    
    private IEnumerator CleanupAndPrepareNext()
    {
        // 게임플레이 오브젝트들 비활성화
        yield return StartCoroutine(DeactivateGameplayObjects());
        
        // 5초간 결과 화면 표시
        yield return new WaitForSeconds(5f);
        
        // 다음 게임 준비
        if (Object.HasStateAuthority)
        {
            PrepareNextGame();
        }
    }
    
    private IEnumerator DeactivateGameplayObjects()
    {
        var gameplayScene = SceneManager.GetSceneByName("GameplayScene");
        if (gameplayScene.isLoaded)
        {
            var rootObjects = gameplayScene.GetRootGameObjects();
            foreach (var obj in rootObjects)
            {
                var networkObj = obj.GetComponent<NetworkObject>();
                if (networkObj != null && networkObj.IsValid)
                {
                    // NetworkObject는 Runner를 통해 Despawn
                    Runner.Despawn(networkObj);
                }
                else
                {
                    // 일반 GameObject는 직접 비활성화
                    obj.SetActive(false);
                }
            }
        }
        yield return null;
    }
    
    private void PrepareNextGame()
    {
        Debug.Log("[GameResult] Preparing next game...");
        
        // 게임 상태 초기화
        CurrentPhase = GamePhase.Initializing;
        WinnerName = "";
        WinnerScore = 0;
        
        // 플레이어 데이터 초기화
        var playersData = _dataManager.PlayersData;
        var playerIds = new List<int>();
        foreach (var kvp in playersData)
        {
            playerIds.Add(kvp.Key);
        }
        
        foreach (var playerId in playerIds)
        {
            var playerData = new PlayerData
            {
                Health = 100f,
                Score = 0,
                Position = Vector3.zero,
                LastUpdated = Runner.Tick
            };
            playersData.Set(playerId, playerData);
        }
        
        // 새 게임 시작
        RPC_StartNewGame();
    }
    
    [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
    void RPC_StartNewGame()
    {
        Debug.Log("[Network] Starting new game...");
        
        // UI 초기화
        var resultUI = FindObjectOfType<ResultUI>();
        resultUI?.HideResults();
        
        var gameUI = FindObjectOfType<GameUI>();
        gameUI?.ResetUI();
        
        // 게임플레이 오브젝트들 재활성화
        StartCoroutine(ReactivateGameplayObjects());
        
        // 게임 시작
        CurrentPhase = GamePhase.Playing;
        
        // 게임 시작 시간 기록
        var gameStats = _dataManager.GlobalGameStats;
        gameStats.GameStartTick = Runner.Tick;
        gameStats.TotalKills = 0;
        gameStats.TotalDeaths = 0;
        _dataManager.GlobalGameStats = gameStats;
    }
    
    private IEnumerator ReactivateGameplayObjects()
    {
        var gameplayScene = SceneManager.GetSceneByName("GameplayScene");
        if (gameplayScene.isLoaded)
        {
            var rootObjects = gameplayScene.GetRootGameObjects();
            foreach (var obj in rootObjects)
            {
                obj.SetActive(true);
                
                // NetworkObject가 있다면 다시 Spawn
                var networkObj = obj.GetComponent<NetworkObject>();
                if (networkObj != null && !networkObj.IsValid)
                {
                    // 필요시 Runner.Spawn 호출
                }
            }
        }
        yield return null;
    }
    
    private string GetPlayerName(int playerId)
    {
        // 실제 구현에서는 플레이어 ID를 이름으로 변환하는 로직 필요
        return $"Player_{playerId}";
    }
}
```

### 7.2 결과 UI 시스템

```csharp
public class ResultUI : MonoBehaviour
{
    [Header("UI Components")]
    [SerializeField] private GameObject resultPanel;
    [SerializeField] private Text winnerText;
    [SerializeField] private Text scoreText;
    [SerializeField] private Text reasonText;
    [SerializeField] private Button nextGameButton;
    
    private void Start()
    {
        if (nextGameButton != null)
        {
            nextGameButton.onClick.AddListener(OnNextGameClicked);
        }
        
        HideResults();
    }
    
    public void ShowResults(int winnerId, string winnerName, int finalScore, string reason)
    {
        if (resultPanel != null)
        {
            resultPanel.SetActive(true);
            
            if (winnerText != null)
                winnerText.text = $"Winner: {winnerName}";
                
            if (scoreText != null)
                scoreText.text = $"Final Score: {finalScore}";
                
            if (reasonText != null)
                reasonText.text = $"Game ended: {reason}";
        }
        
        Debug.Log($"[ResultUI] Showing results - Winner: {winnerName}, Score: {finalScore}");
    }
    
    public void HideResults()
    {
        if (resultPanel != null)
        {
            resultPanel.SetActive(false);
        }
    }
    
    private void OnNextGameClicked()
    {
        Debug.Log("[ResultUI] Next game button clicked");
        HideResults();
    }
}
```

---

## 8. 전체 동작 플로우

### 8.1 시스템 초기화 단계

1. **NetworkRunner 생성**: 공유모드로 세션 시작
2. **기본 씬 로드**: 베이스 씬이 먼저 로드됨
3. **Scene Authority 결정**: 첫 번째 클라이언트가 씬 관리 권한 획득
4. **NetworkSceneManager 초기화**: 커스텀 씬 매니저 설정

### 8.2 멀티씬 로딩 단계

1. **Authority 체크**: Scene Authority를 가진 클라이언트만 씬 로드 수행
2. **Additive 로딩**: UI, 게임플레이, 환경 씬들을 순차적으로 로드
3. **NetworkObject 등록**: 각 씬의 네트워크 오브젝트들을 Runner에 등록
4. **동기화 완료**: 모든 클라이언트에게 로딩 완료 알림

### 8.3 게임플레이 단계

1. **실시간 동기화**: 모든 씬의 NetworkObject들이 자동 동기화
2. **씬 간 통신**: CrossSceneDataManager를 통한 데이터 공유
3. **상태 관리**: 각 씬별 게임 상태 실시간 업데이트
4. **이벤트 처리**: RPC를 통한 씬 간 이벤트 전파

### 8.4 게임 종료 및 결과 처리

1. **승리 조건 감지**: 점수 또는 시간 기반 게임 종료 조건 체크
2. **결과 계산**: 최종 승자 및 점수 결정
3. **전체 알림**: 모든 클라이언트에게 게임 결과 전송
4. **씬 정리**: 게임플레이 오브젝트들 정리 및 UI 업데이트
5. **다음 게임 준비**: 게임 상태 초기화 및 새 게임 시작

---

## 9. 주요 고려사항 및 최적화

### 9.1 성능 최적화

```csharp
public class NetworkOptimizer : MonoBehaviour
{
    [Header("Optimization Settings")]
    [SerializeField] private float cullingDistance = 50f;
    [SerializeField] private int maxNetworkObjects = 1000;
    [SerializeField] private float updateFrequency = 20f; // Hz
    
    [Header("Scene-Specific Settings")]
    [SerializeField] private Dictionary<string, OptimizationProfile> sceneProfiles;
    
    private void Start()
    {
        // 씬별 최적화 프로파일 설정
        SetupSceneOptimization();
    }
    
    private void SetupSceneOptimization()
    {
        sceneProfiles = new Dictionary<string, OptimizationProfile>
        {
            {"UIScene", new OptimizationProfile { UpdateRate = 10f, CullingEnabled = false }},
            {"GameplayScene", new OptimizationProfile { UpdateRate = 60f, CullingEnabled = true }},
            {"EnvironmentScene", new OptimizationProfile { UpdateRate = 30f, CullingEnabled = true }}
        };
    }
    
    // 거리 기반 NetworkObject 컬링
    public void ApplyDistanceCulling(NetworkObject netObj, Vector3 playerPosition)
    {
        float distance = Vector3.Distance(netObj.transform.position, playerPosition);
        
        if (distance > cullingDistance)
        {
            // 원거리 오브젝트는 업데이트 빈도 감소
            netObj.GetComponent<NetworkBehaviour>().enabled = false;
        }
        else
        {
            netObj.GetComponent<NetworkBehaviour>().enabled = true;
        }
    }
}

[System.Serializable]
public class OptimizationProfile
{
    public float UpdateRate;
    public bool CullingEnabled;
    public int MaxObjects;
}
```

### 9.2 메모리 관리

```csharp
public class MemoryManager : MonoBehaviour
{
    [Header("Memory Settings")]
    [SerializeField] private int maxPoolSize = 100;
    [SerializeField] private float cleanupInterval = 30f;
    
    private Dictionary<string, Queue<GameObject>> objectPools;
    private Dictionary<Scene, List<NetworkObject>> sceneNetworkObjects;
    
    private void Start()
    {
        objectPools = new Dictionary<string, Queue<GameObject>>();
        sceneNetworkObjects = new Dictionary<Scene, List<NetworkObject>>();
        
        // 주기적 메모리 정리
        InvokeRepeating(nameof(PerformMemoryCleanup), cleanupInterval, cleanupInterval);
    }
    
    public GameObject GetPooledObject(string prefabName)
    {
        if (!objectPools.ContainsKey(prefabName))
        {
            objectPools[prefabName] = new Queue<GameObject>();
        }
        
        var pool = objectPools[prefabName];
        
        if (pool.Count > 0)
        {
            var obj = pool.Dequeue();
            obj.SetActive(true);
            return obj;
        }
        
        return null; // 새로 생성 필요
    }
    
    public void ReturnToPool(string prefabName, GameObject obj)
    {
        if (!objectPools.ContainsKey(prefabName))
        {
            objectPools[prefabName] = new Queue<GameObject>();
        }
        
        var pool = objectPools[prefabName];
        
        if (pool.Count < maxPoolSize)
        {
            obj.SetActive(false);
            pool.Enqueue(obj);
        }
        else
        {
            Destroy(obj); // 풀이 가득 찬 경우 삭제
        }
    }
    
    private void PerformMemoryCleanup()
    {
        // 비활성화된 씬의 오브젝트들 정리
        foreach (var kvp in sceneNetworkObjects.ToList())
        {
            if (!kvp.Key.isLoaded)
            {
                foreach (var netObj in kvp.Value)
                {
                    if (netObj != null && netObj.IsValid)
                    {
                        netObj.Runner.Despawn(netObj);
                    }
                }
                sceneNetworkObjects.Remove(kvp.Key);
            }
        }
        
        // 가비지 컬렉션 요청
        System.GC.Collect();
        
        Debug.Log("[MemoryManager] Memory cleanup completed");
    }
}
```

### 9.3 에러 처리 및 복구

```csharp
public class NetworkErrorHandler : NetworkBehaviour, INetworkRunnerCallbacks
{
    [Header("Error Handling")]
    [SerializeField] private int maxRetryAttempts = 3;
    [SerializeField] private float retryDelay = 2f;
    
    private int currentRetryCount = 0;
    
    public void OnConnectedToServer(NetworkRunner runner)
    {
        Debug.Log("[ErrorHandler] Connected to server successfully");
        currentRetryCount = 0;
    }
    
    public void OnDisconnectedFromServer(NetworkRunner runner)
    {
        Debug.LogWarning("[ErrorHandler] Disconnected from server");
        AttemptReconnection();
    }
    
    public void OnConnectFailed(NetworkRunner runner, NetAddress remoteAddress, NetConnectFailedReason reason)
    {
        Debug.LogError($"[ErrorHandler] Connection failed: {reason}");
        AttemptReconnection();
    }
    
    private async void AttemptReconnection()
    {
        if (currentRetryCount >= maxRetryAttempts)
        {
            Debug.LogError("[ErrorHandler] Max retry attempts reached. Giving up.");
            ShowConnectionErrorUI();
            return;
        }
        
        currentRetryCount++;
        Debug.Log($"[ErrorHandler] Attempting reconnection ({currentRetryCount}/{maxRetryAttempts})");
        
        await Task.Delay(Mathf.RoundToInt(retryDelay * 1000));
        
        // 재연결 시도
        var gameManager = FindObjectOfType<MultiSceneGameManager>();
        await gameManager.InitializeSharedMode();
    }
    
    private void ShowConnectionErrorUI()
    {
        // 연결 오류 UI 표시
        var errorUI = FindObjectOfType<ErrorUI>();
        errorUI?.ShowConnectionError("서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.");
    }
    
    // Scene 로딩 오류 처리
    public void OnSceneLoadDone(NetworkRunner runner)
    {
        Debug.Log("[ErrorHandler] Scene loading completed");
    }
    
    public void OnSceneLoadStart(NetworkRunner runner)
    {
        Debug.Log("[ErrorHandler] Scene loading started");
    }
}
```

### 9.4 보안 고려사항

```csharp
public class SecurityManager : NetworkBehaviour
{
    [Header("Security Settings")]
    [SerializeField] private bool enableAntiCheat = true;
    [SerializeField] private float maxAllowedSpeed = 10f;
    [SerializeField] private int maxActionsPerSecond = 10;
    
    private Dictionary<PlayerRef, PlayerSecurityData> playerSecurityData;
    
    public override void Spawned()
    {
        playerSecurityData = new Dictionary<PlayerRef, PlayerSecurityData>();
    }
    
    // 플레이어 행동 검증
    public bool ValidatePlayerAction(PlayerRef player, Vector3 newPosition, float deltaTime)
    {
        if (!enableAntiCheat) return true;
        
        if (!playerSecurityData.ContainsKey(player))
        {
            playerSecurityData[player] = new PlayerSecurityData();
        }
        
        var securityData = playerSecurityData[player];
        var distance = Vector3.Distance(securityData.LastPosition, newPosition);
        var speed = distance / deltaTime;
        
        // 속도 검증
        if (speed > maxAllowedSpeed)
        {
            Debug.LogWarning($"[Security] Player {player} exceeded max speed: {speed}");
            return false;
        }
        
        // 액션 빈도 검증
        securityData.ActionCount++;
        if (Time.time - securityData.LastActionTime >= 1f)
        {
            if (securityData.ActionCount > maxActionsPerSecond)
            {
                Debug.LogWarning($"[Security] Player {player} exceeded max actions per second");
                return false;
            }
            
            securityData.ActionCount = 0;
            securityData.LastActionTime = Time.time;
        }
        
        securityData.LastPosition = newPosition;
        return true;
    }
}

[System.Serializable]
public class PlayerSecurityData
{
    public Vector3 LastPosition;
    public float LastActionTime;
    public int ActionCount;
}
```

---

## 10. 문제 해결 가이드

### 10.1 일반적인 문제들

**1. NetworkObject 중복 등록**
```csharp
// 문제: 같은 NetworkId를 가진 오브젝트들이 여러 씬에 존재
// 해결: 씬별로 고유한 NetworkId 범위 할당

public class UniqueNetworkIdManager : MonoBehaviour
{
    private static Dictionary<string, int> sceneIdRanges = new Dictionary<string, int>
    {
        {"UIScene", 1000},
        {"GameplayScene", 2000},
        {"EnvironmentScene", 3000}
    };
    
    public static int GetNextNetworkId(string sceneName)
    {
        if (sceneIdRanges.ContainsKey(sceneName))
        {
            return sceneIdRanges[sceneName]++;
        }
        
        return UnityEngine.Random.Range(10000, 99999);
    }
}
```

**2. 씬 로딩 동기화 문제**
```csharp
// 문제: 클라이언트들 간의 씬 로딩 타이밍 차이
// 해결: 로딩 상태 동기화 및 대기 메커니즘

public class SceneLoadSynchronizer : NetworkBehaviour
{
    [Networked, Capacity(8)] 
    public NetworkDictionary<PlayerRef, bool> PlayerLoadStates { get; }
    
    public void NotifySceneLoaded(PlayerRef player)
    {
        if (Object.HasStateAuthority)
        {
            PlayerLoadStates.Set(player, true);
            
            if (AllPlayersLoaded())
            {
                RPC_AllPlayersReady();
            }
        }
    }
    
    private bool AllPlayersLoaded()
    {
        foreach (var kvp in PlayerLoadStates)
        {
            if (!kvp.Value) return false;
        }
        return true;
    }
    
    [Rpc(RpcSources.StateAuthority, RpcTargets.All)]
    void RPC_AllPlayersReady()
    {
        // 모든 플레이어 준비 완료
        var gameManager = FindObjectOfType<MultiSceneGameManager>();
        gameManager.StartGame();
    }
}
```

### 10.2 성능 문제 해결

**1. 네트워크 트래픽 최적화**
```csharp
public class TrafficOptimizer : NetworkBehaviour
{
    [Networked] public Vector3 Position { get; set; }
    [Networked] public Quaternion Rotation { get; set; }
    
    private Vector3 lastSentPosition;
    private Quaternion lastSentRotation;
    private float sendThreshold = 0.1f;
    
    public override void FixedUpdateNetwork()
    {
        // 변화량이 임계값 이상일 때만 전송
        if (Vector3.Distance(transform.position, lastSentPosition) > sendThreshold ||
            Quaternion.Angle(transform.rotation, lastSentRotation) > 5f)
        {
            Position = transform.position;
            Rotation = transform.rotation;
            
            lastSentPosition = transform.position;
            lastSentRotation = transform.rotation;
        }
    }
}
```

**2. 메모리 누수 방지**
```csharp
public class ResourceManager : MonoBehaviour
{
    private List<IDisposable> disposableResources = new List<IDisposable>();
    
    public void RegisterDisposable(IDisposable resource)
    {
        disposableResources.Add(resource);
    }
    
    private void OnDestroy()
    {
        foreach (var resource in disposableResources)
        {
            try
            {
                resource?.Dispose();
            }
            catch (System.Exception ex)
            {
                Debug.LogError($"Error disposing resource: {ex.Message}");
            }
        }
        
        disposableResources.Clear();
    }
}
```

---

## 11. 참고 문서 및 출처

본 가이드는 다음 공식 문서들을 참조하여 작성되었습니다:

### 주요 참조 문서:
1. **[Fusion 2 - Setting Up A Scene | Photon Engine](https://doc.photonengine.com/fusion/current/tutorials/host-mode-basics/2-setting-up-a-scene)**
   - NetworkRunner 초기화 및 SceneManager 설정 방법

2. **[Fusion 2 - Scene Loading | Photon Engine](https://doc.photonengine.com/fusion/current/manual/scene-loading)**
   - NetworkSceneManagerDefault 구현 및 Version 필드 활용

3. **[Fusion 2 - Network Runner | Photon Engine](https://doc.photonengine.com/fusion/current/manual/network-runner)**
   - StartGame 메서드 및 NetworkSceneInfo 설정

4. **[Fusion 2 - Scene and Player | Photon Engine](https://doc.photonengine.com/fusion/current/tutorials/shared-mode-basics/2-scene-and-player)**
   - 공유모드에서의 씬 설정 및 프로토타입 러너 구성

5. **[Fusion 2 - Network Object | Photon Engine](https://doc.photonengine.com/fusion/current/manual/network-object)**
   - NetworkObject 관리 및 씬 간 동기화

### 추가 리소스:
- **[Photon Fusion: NetworkRunner Class Reference](https://doc-api.photonengine.com/en/fusion/current/class_fusion_1_1_network_runner.html)**
- **[Fusion 2 - Fusion 2 Introduction | Photon Engine](https://doc.photonengine.com/fusion/current/fusion-intro)**

---

## 12. 결론

Photon Fusion 2의 공유모드와 멀티씬 로딩을 결합한 네트워킹 시스템은 복잡하지만 매우 강력한 기능을 제공합니다. 

**핵심 요약:**

### ✅ 주요 장점:
- **고성능**: 틱 기반 시뮬레이션으로 정확한 동기화
- **유연성**: 씬별 독립적 관리 및 동적 로딩
- **확장성**: 대규모 멀티플레이어 게임 지원
- **안정성**: 자동 오류 복구 및 재연결 기능

### ⚠️ 주의사항:
- **Scene Authority 관리**: 씬 관리 권한의 명확한 분리 필요
- **메모리 최적화**: 멀티씬 환경에서의 적절한 리소스 관리
- **네트워크 트래픽**: 씬 간 데이터 동기화 최적화 필수
- **동기화 타이밍**: 클라이언트별 씬 로딩 완료 시점 조율

### 🎯 권장 사항:
1. **단계적 구현**: 기본 기능부터 시작하여 점진적으로 복잡성 추가
2. **충분한 테스트**: 다양한 네트워크 조건에서의 동작 검증
3. **모니터링**: 실시간 네트워크 상태 및 성능 모니터링 구현
4. **문서화**: 팀 내 구현 사항 및 설정값 공유

이 가이드를 통해 안정적이고 효율적인 멀티씬 네트워킹 시스템을 구축하시기 바랍니다.

- 이 글은 ai가 작성했습니다.
