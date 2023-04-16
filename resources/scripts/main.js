/* feather.replace(); */

/*
myAPI practice
*/

/* Api Call Template = https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&units={units}&appid={API key}

Example = https://api.openweathermap.org/data/3.0/onecall?lat=-33.4183&lon=-94.04&exclude=hourly,daily&appid=b637ed3a09b8583db87b829016165aea */

//Page elements
const locationButton = document.querySelector('#location-button');
const myAddress = document.querySelector('#my-address')
const dayName = document.querySelector('.date-dayname');
const dateDay = document.querySelector('.date-day')
const mainTemp = document.querySelector('#main-temp');
const weatherDescription = document.querySelector('.weather-desc');
const precipitation = document.querySelector('#precipitation');
const humidity = document.querySelector('#humidity')
const windSpeed = document.querySelector('#wind-speed');

//Get date
let weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let today = new Date();

//Get location
//Coordinates (Default, Providencia)
/* let lat = -33.42;
let long = -70.60; */

const getLocation = () => {
    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }

    const geoSuccess = (pos) => {
        const coord = pos.coords
        let lat = coord.latitude;
        let long = coord.longitude;
        console.log(lat, long);
        const coordinatesUrl = `latitude=${lat}&longitude=${long}`;
        const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&appid=b637ed3a09b8583db87b829016165aea`;
        getWeather(coordinatesUrl)
        getAddress(geoCodingUrl) 
    }

    const geoError = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`)
    }

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions)
} 

//GetAddress

/* const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&appid=b637ed3a09b8583db87b829016165aea`; */

const getAddress = async (geoCodingUrl) => {
    try {
        const response = await fetch(geoCodingUrl);
        if (response.ok) {
            const geoData = await response.json();
            let address = geoData[0].name;
            myAddress.textContent = address;
        }
    } catch (error) {
        console.log(error)
    }
}

//Get weather

const weatherCallUrl = 'https://api.open-meteo.com/v1/forecast?';
/* const coordinatesUrl = `latitude=${lat}&longitude=${long}`; */
const optionsUrl = '&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m,uv_index&current_weather=true'


/* Options at https://open-meteo.com/en/docs#latitude=-33.42&longitude=-70.60&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m,uv_index&current_weather=true */

const getWeather = async (coordinatesUrl) => {
    const endpoint = `${weatherCallUrl}${coordinatesUrl}${optionsUrl}`
    console.log(endpoint)
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const weatherData = await response.json()
      console.log(weatherData)
      //Extract weather values from API
      let temp = Math.round(weatherData.current_weather.temperature);
      let wind = weatherData.current_weather.windspeed;
      let description = "";
      switch (weatherData.current_weather.weathercode) {
        case 0:
            description = 'Clear Sky'
            break;
        case 1:
            description = 'Mainly clear'
            break;
        case 2:
            description = 'Partly cloudy'
            break;
        case 3:
            description = 'Overcast'
            break;
        case 45 || 48:
            description = 'Fog'
            break;
        case 51 || 53 || 55:
            description = 'Drizzle'
            break;
        case 61:
            description = 'Slight rain'
            break;
        case 63:
            description = 'Moderate rain'
            break;
        case 65:
            description = 'Heavy rain'
            break;
      }
      
      let precipitation12h = () => {
        let precipForecast = weatherData.hourly.precipitation_probability;
        let maxProbability = 0;
        for (let prob of precipForecast){
            if(prob > maxProbability){
                maxProbability = prob;
            }
        }
        return maxProbability
      }

      let humidity2h = weatherData.hourly.relativehumidity_2m[0];



      //Asigning values to app elements
      dayName.textContent = weekdays[today.getDay()]
      dateDay.textContent = `${months[today.getMonth()]} ${today.getDate()}th, ${today.getFullYear()}`
      mainTemp.textContent = `${temp} °C`;
      weatherDescription.textContent = description;
      precipitation.textContent = `${precipitation12h()} %`;
      humidity.textContent = `${humidity2h} %`
      windSpeed.textContent = `${wind} km/h`
      

    }
  } catch (error) {
    console.log(error)
  }
}

const weatherButton = document.querySelector('#weatherButton');


/* locationButton.addEventListener('click', getLocation());
getWeather()
getAddress() */
getLocation()
