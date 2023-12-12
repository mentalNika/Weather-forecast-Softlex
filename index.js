const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "adf4671e71150cb5760619e2712cf111"; // Ключ open weather map

const createWeatherCard = (weatherItem) => {
  return `<li class="card">
            <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
            <img
              src="https://openweathermap.org/img/wn/${
                weatherItem.weather[0].icon
              }@2x.png"
              alt="иконка погоды"
            />
            <p>Темп: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
            <p>Ветер: ${weatherItem.wind.speed} м/с</p>
            <p>Влажность: ${weatherItem.main.humidity}%</p>
          </li>`;
};

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      // Фильтр, который получает только один прогноз погоды в день
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Очистить старую инфу о погоду
      cityInput.value = "";
      weatherCardsDiv.innerHTML = "";

      console.log(fiveDaysForecast);
      fiveDaysForecast.forEach((weatherItem) => {
        weatherCardsDiv.insertAdjacentHTML(
          "beforeend",
          createWeatherCard(weatherItem)
        );
      });
    })
    .catch(() => {
      alert("Ошибка");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim(); // Получает информацию, веденную пользователем в поле input
  if (!cityName) return; // Возвращает, если поле пустое
  const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`Ошибка, не найден город ${cityName}`);
      const { name, lat, lon } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("Ошибка");
    });
};

searchButton.addEventListener("click", getCityCoordinates);
