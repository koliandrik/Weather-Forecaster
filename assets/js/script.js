const searchForm = document.querySelector('#search-form'); // Get the search form element
const cityInput = document.querySelector('#search-input'); // Get the city input element
const savedCitiesList = document.querySelector('#saved-cities'); // Get the saved cities list element
const todayWeather = document.querySelector('#current-weather'); // Get the current weather element
const forecastWeather = document.querySelector('#forecast'); // Get the forecast element
const currentCity = document.querySelector('#result-text'); // Get the current city element

const APIkey = 'd6da1961c6e21afa1580d4b03f0ea31e'; // API key for OpenWeatherMap
let savedCities = []; // Array to store saved cities

// Load saved cities from local storage
const savedCitiesData = localStorage.getItem('savedCities');
if (savedCitiesData) {
  savedCities = JSON.parse(savedCitiesData);
  displaySavedCities(); // Call the displaySavedCities() function to update the saved cities list
}

// Event listener for clicking on a saved city
savedCitiesList.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    let city = event.target.textContent;
    getCityLocation(city);
    currentCity.textContent = city.toUpperCase();
  }
});

// Event listener for form submission
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

// Function to get the location of a city
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

// Function to get the weather data for a city
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

// Function to save a city to the savedCities array
function saveCity(city) {
  if (!savedCities.includes(city)) {
    savedCities.push(city);
    displaySavedCities(); // Call the displaySavedCities() function to update the saved cities list
    // Save updated cities to local storage
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  }
}

// Function to display the saved cities list
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

// Function to display the weather data
// Function to display the weather data
function displayWeather(data) {
  todayWeather.innerHTML = ''; // Clear the current weather element
  forecastWeather.innerHTML = ''; // Clear the forecast element

  let currentWeather = data.current; // Get the current weather data
  let forecast = data.daily; // Get the forecast data

  // Create the HTML for the current weather card
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

  todayWeather.innerHTML = todayWeatherCard; // Add the current weather card to the current weather element

  // Loop through the forecast data and create HTML for each forecast card
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

    forecastWeather.innerHTML += forecastWeatherCard; // Add each forecast card to the forecast element
  }
}