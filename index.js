const cityInput = document.querySelector(".enter-data__input");
const searchButton = document.querySelector(".enter-data__btn");
const body = document.querySelector("body");
const button = document.querySelector(".toogle-btn");

// Функция для сохранения выбранной темы в localStorage
const saveThemeToLocalStorage = (theme) => {
  localStorage.setItem("theme", theme);
};

// Функция для получения выбранной темы из localStorage
const getThemeFromLocalStorage = () => {
  return localStorage.getItem("theme");
};

// Проверяем наличие выбранной темы в localStorage
const savedTheme = getThemeFromLocalStorage();

// Если есть сохраненная тема, применяем ее
if (savedTheme) {
  body.classList.add(savedTheme);
}

// Обработчик события для кнопки переключения темы
button.addEventListener("click", () => {
  body.classList.toggle("dark-theme");

  // Проверяем текущую тему и сохраняем ее в localStorage
  if (body.classList.contains("dark-theme")) {
    saveThemeToLocalStorage("dark-theme");
  } else {
    saveThemeToLocalStorage("");
  }
});

const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "adf4671e71150cb5760619e2712cf111"; // ключ OpenWeatherMap API
const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    // HTML для главной погодной карточки
    return `<div class="details">
                    <h2 class="title">${cityName} ${
      weatherItem.dt_txt.split(" ")[0]
    }</h2>
                    <p class="text">Temperature: ${(
                      weatherItem.main.temp - 273.15
                    ).toFixed(2)}°C</p>
                    <p class="text">Wind: ${weatherItem.wind.speed} м/с</p>
                    <p class="text">Humidity: ${weatherItem.main.humidity}%</p>
                </div>
                <div class="icon">
                    <img class="weather-img" src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }@4x.png" alt="weather-icon">
                    <p class="text">${weatherItem.weather[0].description}</p>
                </div>`;
  } else {
    // HTML для 5-и погодных карточек
    return `<li class="card">
                    <h3 class="title">${weatherItem.dt_txt.split(" ")[0]}</h3>
                    <img class="weather-img" src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }@4x.png" alt="weather-icon">
                    <p class="text">Temp: ${(
                      weatherItem.main.temp - 273.15
                    ).toFixed(2)}°C</p>
                    <p class="text">Wind: ${weatherItem.wind.speed} м/с</p>
                    <p class="text">Humidity: ${weatherItem.main.humidity}%</p>
                </li>`;
  }
};

const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
  fetch(WEATHER_API_URL)
    .then((response) => response.json())
    .then((data) => {
      // Фильтр, который получает только один прогноз погоды в день
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });
      // Очистить старую инфу о погоде
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";
      // Создание погодных карточек и добавление их в DOM
      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", html);
        }
      });
    })
    .catch(() => {
      alert("Ошибка");
    });
  saveCityToLocalStorage(cityName);
};
const getCityCoordinates = (cityName) => {
  const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

  // Получение данных о погоде
  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert(`Город ${cityName} не найден`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("Ошибка");
    });
};

// Функция для сохранения имени города в localStorage
const saveCityToLocalStorage = (cityName) => {
  localStorage.setItem("cityName", cityName);
};

// Функция для получения имени города из localStorage
const getCityFromLocalStorage = () => {
  return localStorage.getItem("cityName");
};

// При загрузке страницы проверяем наличие города в localStorage
// Если есть, получаем прогноз погоды для этого города
window.addEventListener("DOMContentLoaded", () => {
  const cityName = getCityFromLocalStorage();
  if (cityName) {
    getCityCoordinates(cityName);
  }
});

// При открытии сайта отображается погода в Москве
getCityCoordinates("Москва");

// Обработчики событий для кнопок городов
const moscowButton = document.querySelector("#moscow");
const stPetersburgButton = document.querySelector("#stPetersburg");
const rostovButton = document.querySelector("#rostov");

moscowButton.addEventListener("click", () => {
  getCityCoordinates("Москва");
});

stPetersburgButton.addEventListener("click", () => {
  getCityCoordinates("Санкт-Петербург");
});

rostovButton.addEventListener("click", () => {
  getCityCoordinates("Ростов-на-Дону");
});

searchButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") return;
  getCityCoordinates(cityName);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    getCityCoordinates(cityName);
  }
});
