
const appID = "&appid=3034449191d7e019ed5ee40277f84796"
const weatherAPI = "https://api.openweathermap.org/data/2.5/weather?"
const geoAPI = "https://api.openweathermap.org/geo/1.0/direct?q="
const historyAPI = "https://api.open-meteo.com/v1/forecast?"
const historyAPISet = "&daily=temperature_2m_max,temperature_2m_min,rain_sum,showers_sum,snowfall_sum&timezone=auto&"

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
        displayIcon(data.weather[0].icon);
    } catch (error) {
        console.error(error);
    }
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