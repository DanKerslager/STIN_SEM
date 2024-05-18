
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


function getLocation(location) {
    var requestString = geoAPI+location+"&limit=1"+appID
    
    fetch(requestString)

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()  
        })

        .then(data => {
            dataString = JSON.stringify(data)
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            getWeather(latitude, longitude)
            // You can access different properties of the data object to display specific weather information
        })

        .catch(error => {
            console.log(error)
        })
}

function getWeather(lat, lon){
    var requestString = weatherAPI + "lat=" + lat + "&lon=" + lon + appID
    console.log(requestString)
    var outputDiv2 = document.getElementById("output2");

    fetch(requestString)

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()  
        })

        .then(data => {
            dataString = JSON.stringify(data)
            console.log(dataString);
            console.log(data.main.temp)
            outputDiv2.innerHTML = data.weather[0].main + ": " + data.weather[0].description
            displayIcon(data.weather[0].icon)

            // You can access different properties of the data object to display specific weather information
        })

        .catch(error => {
            console.log(error)
        })

}

function displayIcon(code){
    var imgUrl = "https://openweathermap.org/img/wn/"+code+"@2x.png"
    console.log(imgUrl)
    const imgElement = document.createElement('img')
    imgElement.src = imgUrl
    imgfield = document.getElementById('imgContainer')
    imgfield.innerHTML = ""
    imgfield.append(imgElement)
}