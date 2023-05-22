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
const dayZero = document.getElementById('day-zero');
const dayOne = document.getElementById('day-one');
const dayTwo = document.getElementById('day-two');
const dayThree = document.getElementById('day-three');
const dayFour = document.getElementById('day-four');
const currentWeatherDisplay = document.getElementById('current-weather');
const searchHistory = document.getElementById('cities-searched');

function fetchTheWeather(city) {
    var requestURL = `${apiURL}/weather?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(requestURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            fetchForecast(lat, lon);
        
        // Update the HTML elements with the fetched weather data
        cityId.textContent = data.name;
        tempNow.textContent = 'Temperature: ' + data.main.temp + ' °F';
        humidNow.textContent = 'Humidity: ' + data.main.humidity + ' %';
        windNow.textContent = 'Wind Speed: ' + data.wind.speed + ' m/s';
        weatherIcon.src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '.png';
        weatherIcon.alt = data.weather[0].description;
    });
}

function fetchForecast(lat, lon) {
    var forecastURL = `${apiURL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    fetch(forecastURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            // call renderForecast function to render the data
            renderForecast(data);
        });
}

function renderForecast(data) {
    // Get all divs for the days
    const dayDivs = [
        dayZero,
        dayOne,
        dayTwo,
        dayThree,
        dayFour
    ];

    // Loop over each div and set the data
    for (var i = 0; i < dayDivs.length; i++) {
        var dayDiv = dayDivs[i];
        var forecast = data.list[i * 8];

        // Set the date in the h5 element
        var dateElement = dayDiv.querySelector('h5');
        var date = new Date(forecast.dt * 1000);
        dateElement.textContent = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        // Set the weather icon
        var iconElement = dayDiv.querySelector('img');
        var iconCode = forecast.weather[0].icon;
        iconElement.src = "http://openweathermap.org/img/w/" + iconCode + ".png";

        // Set the temperature
        var tempElement = dayDiv.querySelector('.temp-p');
        tempElement.textContent = 'Temp: ' + forecast.main.temp + ' °F';

        // Set the humidity
        var humidElement = dayDiv.querySelector('.humid-p');
        humidElement.textContent = 'Humidity: ' + forecast.main.humidity + '%';
    }
}

function saveCity(city) {
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    if (cities.indexOf(city) === -1) {
        cities.push(city);
    }
    localStorage.setItem('cities', JSON.stringify(cities));
}

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    var city = searchInput.value;
    fetchTheWeather(city);
    fetchForecast(city);
});