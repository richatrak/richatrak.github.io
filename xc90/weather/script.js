// script.js

// 定義獲取天氣資訊的函數
function fetchWeatherData(lat, lon) {
    const apiKey = '5cecab3d855d54a068b054503c70e669';
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=zh_tw&appid=${apiKey}`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            document.getElementById('current-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            document.getElementById('current-temp').textContent = Math.round(data.main.temp);
            document.getElementById('current-description').textContent = data.weather[0].description;
        });

    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=zh_tw&appid=${apiKey}`;

    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = ''; // 清空預報區域
            const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            dailyData.forEach(day => {
                const date = new Date(day.dt * 1000);
                const dayElement = document.createElement('div');
                dayElement.classList.add('forecast-day');

                dayElement.innerHTML = `
                    <div class="forecast-date">${date.toLocaleDateString('zh-TW', { weekday: 'short', month: 'numeric', day: 'numeric' })}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="天氣圖示">
                    <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                    <div class="forecast-desc">${day.weather[0].description}</div>
                `;
                forecastContainer.appendChild(dayElement);
            });
        });
}

// 使用 Geolocation API 獲取使用者位置
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherData(lat, lon);
        },
        error => {
            console.error('無法獲取地理位置', error);
            // 可以考慮提供一個預設位置
            fetchWeatherData(25.0330, 121.5654); // 預設台北市位置
        }
    );
} else {
    console.error('Geolocation 不支援於這個瀏覽器');
    // 提供預設位置
    fetchWeatherData(25.0330, 121.5654); // 預設台北市位置
}
