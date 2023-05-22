// Base URL for the OpenWeather API
const apiURL = "https://api.openweathermap.org/data/2.5";

// OpenWeather API Key
const apiKey = "2d80f2990142a3c995a775d2b5594436";

// DOM elements for manipulation
const searchButton = document.getElementById('search-btn');
const searchInput = document.getElementById('city-search');
const cityId = document.getElementById('city-id');
const tempNow = document.getElementById('temp-now');
const humidNow = document.getElementById('humid-now');
const windNow = document.getElementById('wind-now');
const weatherIcon = document.getElementById('icon-now');
const currentWeatherDisplay = document.getElementById('current-weather');
const searchHistory = document.getElementById('cities-searched');

function fetchTheWeather(city) {
    var requestURL = apiURL + "/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";

    fetch(requestURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        
        // Update the HTML elements with the fetched weather data
        cityId.textContent = data.name;
        tempNow.textContent = 'Temperature: ' + data.main.temp + ' °F';
        humidNow.textContent = 'Humidity: ' + data.main.humidity + ' %';
        windNow.textContent = 'Wind Speed: ' + data.wind.speed + ' m/s';
        weatherIcon.src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png';
        weatherIcon.alt = data.weather[0].description;
    });
}

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    var city = searchInput.value;
    fetchTheWeather(city);
});