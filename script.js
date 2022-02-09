

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var APIkey = "d695cd030163d3bbeb3c1729339cf830";
const cityInput = $("#city-submit")
const cityEl = $("#city-name")
const prevCityList = $("#prev-cities-list")
let prevCities = [];

function init() {
    // Checking to see if the key already exists, if not, set an empty array converted to a string to localstorage
    if (localStorage.getItem("prevCities") === null) {
        localStorage.setItem("prevCities", JSON.stringify(prevCities));
    };

    // Immediately parse that array so we can push to it as cities are searched
    prevCities = JSON.parse(localStorage.getItem("prevCities"));

    // If there are any cities that have been pulled down from localStorage, run the function to append a button for each
    updatePrevUI(prevCities);
}



function searchHandler(e) {
    e.preventDefault();
    var userCity = $(this).siblings("input").val();
    if (!userCity) {
        userCity = $(this).text();
    }
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + APIkey;
    fetch(queryURL).then(function (response) {
        return response.json()
    }).then(function (data) {
        console.log(data);
        var lat = data.coord.lat
        var lon = data.coord.lon
        var oneCallAPIURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIkey;
        fetch(oneCallAPIURL).then(function (response) {
            return response.json()
        }).then(function (data) {
            console.log(data);
            displayCurrent(data, userCity);
            fiveDay(data);
        })
        if (prevCities.includes(userCity) === false) {
            prevCities.push(userCity);
        }

        // Uodating the recentCities array in localStorage
        localStorage.setItem("prevCities", JSON.stringify(prevCities));

        updatePrevUI(prevCities);
    })
}

function displayCurrent(weather, userCity) {
    var currentWeatherEl = $("#currentWeather")
    var cardText = currentWeatherEl.children("div.card-body")
    cardText.children("h5").text(weather.timezone)
    var formatTime = new Date(weather.current.dt * 1000)
    cardText.children("h6").text(formatTime)
    var iconUrl = "http://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png"
    cardText.children("img").attr("src", iconUrl)
    cardText.children("#temperature").text(`Current Temp: ${weather.current.temp}F`)
    cardText.children("#humidity").text(`Current Humidity: ${weather.current.humidity}`)
    cardText.children("#windSpeed").text(`Current Wind Speed: ${weather.current.wind_speed} mph`)
    cardText.children("#uvIndex").text(`Current UV Index: ${weather.current.uvi}`)
    if (weather.current.uvi <= 2) {
        cardText.children("#uvIndex").css("background-color", "green")


    } else if (weather.current.uvi > 2 || weather.current.uvi < 6) {
        cardText.children("#uvIndex").css("background-color", "yellow")
    } else if (weather.current.uvi > 5 || weather.current.uvi < 8) {
        cardText.children("#uvIndex").css("background-color", "orange")
    } else if (weather.current.uvi > 7 || weather.current.uvi < 11) { 
        cardText.children("#uvIndex").css("background-color", "red")
    }



    if (prevCities.includes(userCity) === false) {
        prevCities.push(userCity);
    }

    // Uodating preCities in localStorage
    localStorage.setItem("prevCities", JSON.stringify(prevCities));

    updatePrevUI(prevCities);

}



function fiveDay(weather) {
    var forecastElement = $("#five")
    forecastElement.empty();
    for (let i = 0; i < 5; i++) {
        
        console.log(weather)
        var dailyStuff = weather.daily[i]
      

        var dailyTime = new Date(dailyStuff.dt * 1000)
      

        let fiveDayCard = `
        <div class="col-md-2 m-2 py-3 card text-white bg-primary">
            <div class="card-body p-1">
                <h5 class="card-title"> ${dailyTime} </h5>
                <img src="https://openweathermap.org/img/wn/${dailyStuff.weather[0].icon}.png" alt="rain">
                <p class="card-text">Temp:  ${dailyStuff.temp.day}</p>
                <p class="card-text">Wind Speed:  ${dailyStuff.wind_speed}</p>
                <p class="card-text">Humidity:  ${dailyStuff.humidity}</p>
            </div>
        </div>
        `;
        forecastElement.append(fiveDayCard);


    }

}



function updatePrevUI(array) {
    prevCityList.empty();

    for (let i = 0; i < array.length; i++) {
        let prevCityItem = document.createElement("button");
        prevCityItem.textContent = array[i];
        prevCityList.append(prevCityItem);
    }
}

$("#prev-cities-list").on("click", "button", searchHandler)
$("button").on("click", searchHandler)