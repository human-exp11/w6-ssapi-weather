

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

function searchHandler(e) {
    e.preventDefault();
    var userCity = $(this).siblings("input").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + APIkey;
    fetch(queryURL).then(function(response){
        return response.json()
    }) .then(function(data){
        console.log (data);
       var  lat = data.coord.lat
       var  lon = data.coord.lon
        var oneCallAPIURL= "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid="+APIkey;
        fetch(oneCallAPIURL).then(function(response){
            return response.json()
        }) .then(function(data){
            console.log (data);
            displayCurrent(data);
        })
    })
}

function displayCurrent(weather) {
    var currentWeatherEl = $("#currentWeather")
    var cardText = currentWeatherEl.children("div.card-body")
    cardText.children("h5").text(weather.timezone)
    cardText.children("h6").text(weather.current.dt)
    var iconUrl = "http://openweathermap.org/img/wn/" + weather.current.weather[0].icon + "@2x.png"
    cardText.children("img").attr("src", iconUrl)
    cardText.children("#temperature").text(weather.current.temp)
    cardText.children("#humidity").text(weather.current.humidity)
    cardText.children("#windSpeed").text(weather.current.wind_speed)
    cardText.children("#uvIndex").text(weather.current.uvi)
}



//------ 5-Day Forecast

fetchFiveDay = function () {
    var fiveDayEl = $("#fiveDay")
    var perfectAPIURL = "https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=current,hourly,minutely,alerts&units=metric&appid=" + APIkey;

    fetch(perfectAPIURL).then(function (response) {
        if (200 !== response.status) {
            console.log(
                "Uh Oh. Status Code: " + response.status
            );
            return response.json();
        }

        fiveDayEl[0].classList.add("loaded")

        response.json().then(function (data) {
            var fday = "";
            data.daily.forEach((value, index) => {
                if (index > 0) {
                    var dayname = new Date(value.dt * 1000).toLocaleDateString("en", {
                        weekday: "long",
                    });
                    var icon = value.weather[0].icon;
                    var temp = value.temp.day.toFixed(0);
                    fday = `<div class="forecast-day">
						<p>${dayname}</p>
						<p><span class="ico-${icon}" title="${icon}"></span></p>
						<div class="forecast-day--temp">${temp}<sup>°C</sup></div>
					</div>`;
                    fiveDayEl[0].insertAdjacentHTML('beforeend', fday);

                    return response.json();
                    // .catch(function (err) {
                    //     console.log("Fetch Error :-S", err);
                }

            });
        });


    });


};



//function fiveDay(weather){
    //createEL and set vale
    //append to section

   // fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial")
//}


$("button").on("click", searchHandler)