const API_KEY = "6b167018d3703cb8d023b66f4b0ccb34";
const weather = document.getElementById("weather");

function showWeatherMessage(message) {
    weather.innerText = message;
    weather.classList.remove("hidden");
}

function formatWeatherDescription(description) {
    const descriptions = {
        "온흐림": "흐림",
        "구름": "구름 많음",
        "흩어진 구름": "구름 조금",
        "튼구름": "구름 많음",
        "맑음": "맑음",
        "실 비": "가벼운 비",
        "박무": "옅은 안개"
    };

    return descriptions[description] || description;
}

function onGeoOk(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=kr`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Weather request failed");
            }
            return response.json();
        })
        .then((data) => {
            const city = data.name;
            const temp = Math.round(data.main.temp);
            const description = formatWeatherDescription(data.weather[0].description);

            showWeatherMessage(`${city} ${temp}\u00B0C / ${description}`);
        })
        .catch(() => {
            showWeatherMessage("Weather is unavailable.");
        });
}

function onGeoError() {
    showWeatherMessage("Allow location access to show weather.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
