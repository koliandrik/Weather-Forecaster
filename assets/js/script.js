const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#search-input');
const savedCitiesList = document.querySelector('#saved-cities');
const todayWeather = document.querySelector('#current-weather');
const forecastWeather = document.querySelector('#forecast');
const currentCity = document.querySelector('#result-text');

const APIkey = 'd6da1961c6e21afa1580d4b03f0ea31e';
let savedCities = [];

// Load saved cities from local storage
const savedCitiesData = localStorage.getItem('savedCities');
if (savedCitiesData) {
  savedCities = JSON.parse(savedCitiesData);
  displaySavedCities(); // Call the displaySavedCities() function to update the saved cities list
}

savedCitiesList.addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    let city = event.target.textContent;
    getCityLocation(city);
    currentCity.textContent = city.toUpperCase();
  }
});

searchForm.addEventListener('submit', formSubmitHandler);

function formSubmitHandler(event) {
  event.preventDefault();

  let city = cityInput.value.trim();

  if (city) {
    saveCity(city);
    getCityLocation(city);
    cityInput.value = '';
    currentCity.textContent = city.toUpperCase();
  } else {
    alert('Please enter a city');
  }
}

async function getCityLocation(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    let cityData = data[0];
    getWeather(cityData);
  } catch (error) {
    console.log(error);
  }
}

async function getWeather(cityData) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityData.lat}&lon=${cityData.lon}&exclude=minutely,hourly&appid=${APIkey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  } catch (error) {
    console.log(error);
  }
}

function saveCity(city) {
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    displaySavedCities(); // Call the displaySavedCities() function to update the saved cities list
    // Save updated cities to local storage
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }
}

function displaySavedCities() {
  savedCitiesList.innerHTML = '';

  for (let i = 0; i < savedCities.length; i++) {
    let city = savedCities[i];
    let cityItem = document.createElement('li');
    cityItem.className = 'list-group-item';
    cityItem.classList.add('btn', 'btn-primary', 'bg-info', 'm-1');
    cityItem.innerHTML = `${city.toUpperCase()}`;
    savedCitiesList.appendChild(cityItem);
  }
}

function displayWeather(data) {
  todayWeather.innerHTML = '';
  forecastWeather.innerHTML = '';

  let currentWeather = data.current;
  let forecast = data.daily;

  let todayWeatherCard = `
    <div class="card col bg-info">
      <div class="card-body">
        <h5 class="card-title bg-primary rounded p-1 ">Current Weather:</h5>
        <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
        <h5 class="card-title bg-primary rounded p-1 ">${currentWeather.weather[0].description.toUpperCase()}</h5>
        <p class="card-text bg-primary rounded p-1 ">Temp: ${currentWeather.temp}°F</p>
        <p class="card-text bg-primary rounded p-1 ">Wind: ${currentWeather.wind_speed} MPH</p>
        <p class="card-text bg-primary rounded p-1 ">Humidity: ${currentWeather.humidity}%</p>
        <p class="card-text bg-primary rounded p-1 ">UV Index: ${currentWeather.uvi}</p>
      </div>
    </div>
  `;

  todayWeather.innerHTML = todayWeatherCard;

  for (let i = 0; i < 5; i++) {
    let forecastWeatherCard = `
      <div class="card col-12 col-md-5 col-lg-2 m-1 p-0 bg-info">
      <div class="card-body">
      <h5 class="card-title bg-primary rounded p-1  ">${new Date(forecast[i].dt * 1000).toLocaleDateString()}</h5>
      <h6 class="card-title bg-primary rounded p-1 ">${forecast[i].weather[0].description.toUpperCase()}</h6>
      <img src="https://openweathermap.org/img/wn/${forecast[i].weather[0].icon}.png" alt="Weather Icon">
      <p class="card-text bg-primary rounded p-1 ">${forecast[i].summary}</p>
      <p class="card-text bg-primary rounded p-1 ">Temp: ${forecast[i].temp.day}°F</p>
      <p class="card-text bg-primary rounded p-1 ">Wind: ${forecast[i].wind_speed} MPH</p>
      <p class="card-text bg-primary rounded p-1 ">Humidity: ${forecast[i].humidity}%</p>
      </div>
      </div>
    `;

    forecastWeather.innerHTML += forecastWeatherCard;
  }
}

/*
const cityInput = document.querySelector('#search-input');
const savedCitiesList = document.querySelector('#saved-cities');
const todayWeather = document.querySelector('#current-weather');
const forecastWeather = document.querySelector('#forecast');
const currentCity = document.querySelector('#result-text');

const APIkey = 'd6da1961c6e21afa1580d4b03f0ea31e';
let savedCities = [];

// Load saved cities from local storage
const savedCitiesData = localStorage.getItem('savedCities');
if (savedCitiesData) {
  savedCities = JSON.parse(savedCitiesData);
  displaySavedCities(); // Call the displaySavedCities() function to update the saved cities list
}

savedCitiesList.addEventListener('click', function(event) {
  if (event.target.tagName === 'BUTTON') {
    let city = event.target.textContent;
    getCityLocation(city);
    currentCity.textContent = city.toUpperCase();
  }
});

function saveCity(city) {
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    displaySavedCities(); // Call the displaySavedCities() function to update the saved cities list
    // Save updated cities to local storage
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }
}

function displaySavedCities() {
  savedCitiesList.innerHTML = '';

  for (let i = 0; i < savedCities.length; i++) {
    let city = savedCities[i];
    let cityItem = document.createElement('li');
    cityItem.className = 'list-group-item';
    cityItem.classList.add('btn', 'btn-primary', 'm-1');
    cityItem.innerHTML = `${city.toUpperCase()}`;
    savedCitiesList.appendChild(cityItem);
  }
}

function formSubmitHandler(event) {
  event.preventDefault();

  let city = cityInput.value.trim();

  if (city) {
    saveCity(city);
    getCityLocation(city);
    cityInput.value = '';
    currentCity.textContent = city.toUpperCase();
  } else {
    alert('Please enter a city');
  }
}

async function getCityLocation(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    let cityData = data[0];
    getWeather(cityData);
  } catch (error) {
    console.log(error);
  }
}

async function getWeather(cityData) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityData.lat}&lon=${cityData.lon}&exclude=minutely,hourly&appid=${APIkey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    displayWeather(data);
  } catch (error) {
    console.log(error);
  }
}

function displayWeather(data) {
  todayWeather.innerHTML = '';
  forecastWeather.innerHTML = '';

  let currentWeather = data.current;
  let forecast = data.daily;

  let todayWeatherCard = `
    <div class="card col bg-info">
      <div class="card-body">
        <h5 class="card-title">Current Weather:</h5>
        <img src="https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather Icon">
        <h5 class="card-title">${currentWeather.weather[0].description}</h5>
        <p class="card-text">Temp: ${currentWeather.temp}°F</p>
        <p class="card-text">Wind: ${currentWeather.wind_speed} MPH</p>
        <p class="card-text">Humidity: ${currentWeather.humidity}%</p>
        <p class="card-text">UV Index: ${currentWeather.uvi}</p>
      </div>
    </div>
  `;

  todayWeather.innerHTML = todayWeatherCard;

  for (let i = 0; i < 5; i++) {
    let forecastWeatherCard = `
      <div class="card col-12 col-md-5 col-lg-2 m-1 p-1 bg-info">
      <div class="card-body">
        <h5 class="card-title">${new Date(forecast[i].dt * 1000).toLocaleDateString()}</h5>
        <h6 class="card-title">${forecast[i].weather[0].description.toUpperCase()}</h6>
        <img src="https://openweathermap.org/img/wn/${forecast[i].weather[0].icon}.png" alt="Weather Icon">
        <p class="card-text">Temp: ${forecast[i].temp.day}°F</p>
        <p class="card-text">Wind: ${forecast[i].wind_speed} MPH</p>
        <p class="card-text">Humidity: ${forecast[i].humidity}%</p>
      </div>
      </div>
    `;

    forecastWeather.innerHTML += forecastWeatherCard;
  }
}

searchForm.addEventListener('submit', formSubmitHandler);
*/