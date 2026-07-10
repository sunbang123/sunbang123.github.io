const clock = document.getElementById("clock");

let timestamp;
let timerId;

// 현재시각
function syncTimestamp() {
  const date = new Date();
                      // 현재시간을 초단위로.. // 현재 날짜 객체를 초단위로! (형변환도) // 1000으로 나눈다 => milisecond 뺀, 초 값
  timestamp = Math.floor((date.getTime() - new Date(date.toLocaleDateString())) / 1000);
  // date.toLocaleDateString() -> 날짜 객체의 날짜(시간을 제외한)를 문자열로 반환해준다.
}

function tick() {
    clock.innerText = getDateFormatByTimestamp(timestamp);
    timestamp++; // 
    
    timerId = setTimeout(tick, 1000 - (Date.now() % 1000)); // tick은 1초가 지나면 재귀 호출( 함수내에서 함수 자신을 불러오는거)
};

syncTimestamp();
tick();

// 1분(60,000ms)마다 아예 외부에서 강제로 싱크를 맞추는 독립된 관리자
setInterval(() => {
    syncTimestamp();
}, 60000);

// 절전모드(탭 비활성화) 방어 로직
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        clearTimeout(timerId);
        syncTimestamp();
        tick();
    }
});

// timestamp를 시계로 바꿔줌.
function getDateFormatByTimestamp(timestamp) {
    let seconds = timestamp % 60;
    let minutes = ((timestamp - seconds) / 60) % 60;
    let hours = (timestamp - seconds - (minutes * 60)) / 3600;
    
    // String이 2자리수가 아닐 경우 0을 추가해준다. -> 00:00:00 ~... 이렇게 작동되도록!
    const currentHours = String(hours).padStart(2, "0");
    const currentMinutes = String(minutes).padStart(2, "0");
    const currentSeconds = String(seconds).padStart(2, "0");

    return `${currentHours}:${currentMinutes}:${currentSeconds}`;
}