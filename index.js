// index.js

const appID = "&appid=3034449191d7e019ed5ee40277f84796"
const weatherAPI = "https://api.openweathermap.org/data/2.5/weather?"
const geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q="
const historyAPI = "https://api.open-meteo.com/v1/forecast?"
const historyAPISet = "&daily=temperature_2m_max,temperature_2m_min,rain_sum,showers_sum,snowfall_sum&timezone=auto&"



function writeText() {
    // Get the input value
    var inputValue = document.getElementById("location").value;

    // Get the div where you want to output the text
    var outputDiv1 = document.getElementById("output1");
    var outputDiv2 = document.getElementById("output2");
    // Append the input value to the output div
    outputDiv1.innerHTML = "You entered: " + inputValue;
    //getLocation(inputValue)
    inputHandler(inputValue)
}

document.addEventListener('DOMContentLoaded', () => {
    const findButton = document.getElementById('findButton');
    if (findButton) {
        findButton.addEventListener('click', writeText);
    } else {
        console.error("Button with ID 'findButton' not found");
    }
});


async function inputHandler(location){
    const coordinates = await getLocation(location)
    const weatherData = await getWeather(coordinates)
    displayIcon(weatherData.weather[0].icon)
    
    const userDiv = document.getElementById('user');
    if (userDiv.innerText.trim() !== '') {
        const historicalData = await fetchHistoricalData(coordinates)
        displayHistoricalData(historicalData)
    }

}

async function getLocation(location) {
    var requestString = geoAPI+location+"&limit=1"+appID   
    try {
        const response = await fetch(requestString);
        const data = await response.json();
        return [data[0].lat, data[0].lon];
    } catch (error) {
        console.error(error);
    }
}

async function getWeather(coordinates) {
    var requestString = weatherAPI + "lat=" + coordinates[0] + "&lon=" + coordinates[1] + appID
    
    try {
        const response = await fetch(requestString);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}

function displayIcon(code){
    var imgUrl = "https://openweathermap.org/img/wn/"+code+"@2x.png"
    const imgElement = document.createElement('img')
    imgElement.src = imgUrl
    const imgfield = document.getElementById('imgContainer')
    imgfield.innerHTML = ""
    imgfield.append(imgElement)
}

async function fetchHistoricalData(coordinates) {
    const historyData = [];
    const fetchPromises = [];

    for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i); // Adjusting date by subtracting i days for historical data
        const formattedDate = date.toISOString().split('T')[0];

        const url = `${historyAPI}latitude=${coordinates[0]}&longitude=${coordinates[1]}${historyAPISet}start_date=${formattedDate}&end_date=${formattedDate}`;
        
        // Collecting fetch promises
        fetchPromises.push(
            fetch(url).then(response => response.json())
        );
    }

    try {
        const results = await Promise.all(fetchPromises);

        results.forEach(data => {
            if (data.cod === '404') {
                console.log("off")
                alert("City not found");
                return;
            }
            const { time, temperature_2m_max, temperature_2m_min, rain_sum, showers_sum, snowfall_sum } = data.daily;
            
            historyData.push({
                date: time,
                maxTemp: parseInt(temperature_2m_max),
                minTemp: parseInt(temperature_2m_min),
                rain: parseInt(rain_sum),
                shower: parseInt(showers_sum),
                snow: parseInt(snowfall_sum)
            });
        });

        return historyData;
    } catch (error) {
        console.error("Error fetching historical data:", error);
    }
}

function displayHistoricalData(historyData) {

    let tableHeader = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Max Temp</th>
                    <th>Min Temp</th>
                    <th>Rain</th>
                    <th>Shower</th>
                    <th>Snow</th>
                </tr>
            </thead>
            <tbody>`;

    const tableBody = historyData.map(createRow).join('');
    const tableFooter = `</tbody></table>`;

    const historyTableElement = document.getElementById("historical");
    historyTableElement.innerHTML = tableHeader + tableBody + tableFooter;
}

function createRow(data) {
    return `
        <tr>
            <td>${data.date}</td>
            <td>${data.maxTemp}°C</td>
            <td>${data.minTemp}°C</td>
            <td>${data.rain}mm</td>
            <td>${data.shower}mm</td>
            <td>${data.snow}cm</td>
        </tr>`;
}


module.exports = { writeText, getLocation, getWeather, displayIcon, fetchHistoricalData, displayHistoricalData, createRow }