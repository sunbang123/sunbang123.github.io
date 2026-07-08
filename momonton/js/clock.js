const clock = document.getElementById("clock");

// 현재시각
const date = new Date();
                    // 현재시간을 초단위로.. // 현재 날짜 객체를 초단위로! (형변환도) // 1000으로 나눈다 => milisecond 뺀, 초 값
let timestamp = Math.floor((date.getTime() - new Date(date.toLocaleDateString())) / 1000);
// date.toLocaleDateString() -> 날짜 객체의 날짜(시간을 제외한)를 문자열로 반환해준다.

clock.innerText = getDateFormatByTimestamp(timestamp);
timestamp++;

let timerId = setTimeout(function tick() {
    clock.innerText = getDateFormatByTimestamp(timestamp);
    timestamp++; // 
    timerId = setTimeout(tick, 1000); // tick은 1초가 지나면 재귀 호출( 함수내에서 함수 자신을 불러오는거)
  }, 1000); // 요청 간격 1초가 지나면 tick이 실행되도록...

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