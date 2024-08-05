const apiKey = "cac0fb3b4f644470bf1402019e63b59f";
const apiBaseURL = "https://api.weatherbit.io/v2.0/current";
const apiForecastURL = "https://api.weatherbit.io/v2.0/forecast/daily";

function fetchWeather(city) {
  const url = `${apiBaseURL}?city=${encodeURIComponent(city)}&key=${apiKey}`;

  axios
    .get(url)
    .then((response) => {
      console.log("API Response:", response.data);
      const weatherInfo = response.data;
      updateWeatherDisplay(city, weatherInfo);
      fetchForecast(city);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      document.getElementById("current-city").innerHTML =
        "<strong>Error fetching data</strong>";
      document.getElementById("temperature").innerHTML = "";
      document.getElementById("weather-details").innerHTML =
        "Sorry, there was an error retrieving the weather data.";
      document.getElementById("weather-icon").innerHTML = "";
    });
}

function fetchForecast(city) {
  const url = `${apiForecastURL}?city=${encodeURIComponent(city)}&key=${apiKey}&days=7`;

  axios
    .get(url)
    .then((response) => {
      console.log("Forecast Response:", response.data);
      const forecastData = response.data.data;
      updateForecastDisplay(forecastData);
    })
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
      document.getElementById("forecast").innerHTML =
        "Sorry, there was an error retrieving the forecast data.";
    });
}

function updateWeatherDisplay(city, weatherInfo) {
  if (weatherInfo && weatherInfo.data && weatherInfo.data[0]) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    document.getElementById("current-city").innerHTML =
      `<strong>${cityName}</strong>`;

    const tempCelsius = Math.round(weatherInfo.data[0].temp);
    const humidity = weatherInfo.data[0].rh;
    const windSpeed = (weatherInfo.data[0].wind_spd * 3.6).toFixed(1);
    const description = weatherInfo.data[0].weather.description;
    const iconCode = weatherInfo.data[0].weather.icon;
    const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

    document.getElementById("temperature").innerHTML =
      `<strong>${tempCelsius}&deg;C</strong>`;
    document.getElementById("weather-details").innerHTML =
      `Humidity: <strong>${humidity}%</strong>, Wind: <strong>${windSpeed} km/h</strong>, Description: <strong>${description}</strong>`;
    document.getElementById("icon-image").src = iconUrl;
  } else {
    document.getElementById("current-city").innerHTML =
      "<strong>City not found</strong>";
    document.getElementById("temperature").innerHTML = "";
    document.getElementById("weather-details").innerHTML =
      "Sorry, we don't know the weather for this city.";
    document.getElementById("weather-icon").innerHTML = "";
  }
}

function updateForecastDisplay(forecastData) {
  const now = new Date();
  const todayIndex = now.getDay();

  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "<h2>7-Day Forecast</h2>";

  const forecastGrid = document.createElement("div");
  forecastGrid.classList.add("forecast-grid");

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  forecastData.forEach((forecast, index) => {
    if (index !== 0) { // Skip the current day
      const forecastDay = document.createElement("div");
      forecastDay.classList.add("forecast-day");

      const dayIndex = (todayIndex + index) % 7;
      const dayName = days[dayIndex];

      const tempCelsius = Math.round(forecast.temp);
      const iconCode = forecast.weather.icon;
      const iconUrl = `https://www.weatherbit.io/static/img/icons/${iconCode}.png`;

      forecastDay.innerHTML = `
        <p>${dayName}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>${tempCelsius}&deg;C</p>
      `;

      forecastGrid.appendChild(forecastDay);
    }
  });

  forecastContainer.appendChild(forecastGrid);
}

document
  .getElementById("search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("search-input").value.trim();
    if (city) {
      fetchWeather(city);
    } else {
      document.getElementById("current-city").innerHTML =
        "<strong>Please enter a city name</strong>";
      document.getElementById("temperature").innerHTML = "";
      document.getElementById("weather-details").innerHTML = "";
      document.getElementById("weather-icon").innerHTML = "";
    }
  });

function updateTime() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[now.getDay()];
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("current-date").textContent =
    `${day} ${hours}:${minutes}`;
}

setInterval(updateTime, 1000);
updateTime();

fetchWeather("Cape Town");
