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

// Function for fetching the current weather data from OpenWeather API
function fetchTheWeather(city) {
    // Request URL for the OpenWeather API
    var requestURL = `${apiURL}/weather?q=${city}&appid=${apiKey}&units=imperial`;

    // Fetch data from the OpenWeather API
    fetch(requestURL)
        .then(function(response) {
            // Convert the response to JSON format
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            // Extract the latitude and longitude from the data
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            console.log(lat, lon);

            // Fetch the forecast using the latitude and longitude
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

// Function to fetch the forecast data from the OpenWeather API
function fetchForecast(lat, lon) {
    // Request URL for the OpenWeather API for 5-day forecast data
    var forecastURL = `${apiURL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    // Fetch the forecast data from the OpenWeather API
    fetch(forecastURL)
        .then(function(response) {
            // Convert the response to JSON format
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            // Call to renderForecast function to render the data
            renderForecast(data);
        });
}

// Function to render the forecast data in the HTML document
function renderForecast(data) {
    // Get all divs for the days
    const dayDivs = [dayZero, dayOne, dayTwo, dayThree, dayFour];

    // Loop over each div and set the data
    for (var i = 0; i < dayDivs.length; i++) {
        var dayDiv = dayDivs[i];
        var forecast = data.list[i * 8];

        // If there is weather data available for the given index, update the HTML element
        if (forsecast.weather && forecast.weather.length > 0) {
            // Set the date
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
        } else {
            console.log(`No weather data available for index ${i * 8}`);
        }
    }
}

// Function to save the city to localStorage
function saveCity(city) {
    // Get the cities from localStorage, or create a new array if none exist
    var cities = JSON.parse(localStorage.getItem('cities')) || [];

    // If the city is not already in the list, add it
    if (cities.indexOf(city) === -1) {
        cities.push(city);
    }

    // Save the updated list of cities back to localStorage
    localStorage.setItem('cities', JSON.stringify(cities));
}

// Function to load the cities from localStorage and display them in the HTML document
function loadCities() {
    // Get the cities from localStorage, or create a new array if none exist
    var cities = JSON.parse(localStorage.getItem('cities')) || [];
    var citiesList = document.getElementById('cities-searched');
    citiesList.innerHTML = '';

    // Loop over each city and add it to the HTML document
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', function(event) {
            // When a city is clicked, fetch the weather for that city
            fetchTheWeather(event.target.textContent);
        });
        citiesList.appendChild(li);
    }
}

// When the document has loaded, load the cities
document.addEventListener('DOMContentLoaded', loadCities);

// When the search button is clicked, fetch the weather for the input city, save the city, and reload the cities
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    var city = searchInput.value;
    fetchTheWeather(city);
    saveCity(city);
    loadCities();
});