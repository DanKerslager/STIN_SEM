// index.js

const appID = "&appid=3034449191d7e019ed5ee40277f84796"
const weatherAPI = "https://api.openweathermap.org/data/2.5/weather?"
const geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q="
const currentLocation = ""



function writeText() {
    // Get the input value
    var inputValue = document.getElementById("location").value;

    // Get the div where you want to output the text
    var outputDiv1 = document.getElementById("output1");
    var outputDiv2 = document.getElementById("output2");
    // Append the input value to the output div
    outputDiv1.innerHTML = "You entered: " + inputValue;
    getLocation(inputValue)
}


async function getLocation(location) {
    var requestString = geoAPI+location+"&limit=1"+appID
    
    try {
        const response = await fetch(requestString);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        getWeather(latitude, longitude);
    } catch (error) {
        console.error(error);
    }
}

async function getWeather(lat, lon) {
    var requestString = weatherAPI + "lat=" + lat + "&lon=" + lon + appID
    
    try {
        const response = await fetch(requestString);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        console.log(data.main.temp);
        displayWeather(data);
    } catch (error) {
        console.error(error);
    }
}

function displayIcon(code){
    var imgUrl = "https://openweathermap.org/img/wn/"+code+"@2x.png"
    console.log(imgUrl)
    const imgElement = document.createElement('img')
    imgElement.src = imgUrl
    const imgfield = document.getElementById('imgContainer')
    imgfield.innerHTML = ""
    imgfield.append(imgElement)
}

export{ writeText, getLocation, getWeather, displayIcon }