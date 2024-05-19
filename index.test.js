// Import the functions to be tested
import { writeText, getLocation, getWeather, displayIcon, fetchHistoricalData, displayHistoricalData, createRow } from "./index.js"

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe('writeText function', () => {
  it('should update outputDiv1 innerHTML with the entered text', () => {
    document.body.innerHTML = `
      <input id="location" value="New York">
      <div id="output1"></div>
      <div id="output2"></div>
    `;
    const inputValue = document.getElementById('location').value;
    writeText();
    expect(document.getElementById('output1').innerHTML).toBe('You entered: ' + inputValue);
  });
});

describe('getLocation function', () => {
  it('should fetch data from geoAPI with the provided location', async () => {
    await getLocation('New York');
    expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/geo/1.0/direct?q=New York&limit=1&appid=3034449191d7e019ed5ee40277f84796');
  });

  it('should handle error when fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    console.error = jest.fn(); // Mock console.error
    await getLocation('New York');
    const receivedError = console.error.mock.calls[0][0];
    expect(receivedError.message).toBe('Network error');
  });
});

describe('getWeather function', () => {
  it('should fetch weather data using latitude and longitude', async () => {
    await getWeather(40.7128, -74.0060);
    expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.006&appid=3034449191d7e019ed5ee40277f84796');
  });

  it('should handle error when fetch fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
    console.error = jest.fn(); // Mock console.error
    await getWeather(40.7128, -74.0060);
    const receivedError = console.error.mock.calls[0][0];
    expect(receivedError.message).toBe('Network error');
  });
});

describe('fetchHistoricalData function', () => {
  it('should fetch historical weather data', async () => {
    const mockData = {
      daily: [
        { time: '2024-05-01', temperature_2m_max: 20, temperature_2m_min: 10, rain_sum: 5, showers_sum: 3, snowfall_sum: 0 },
        { time: '2024-05-02', temperature_2m_max: 22, temperature_2m_min: 12, rain_sum: 2, showers_sum: 1, snowfall_sum: 0 }
      ]
    };
    fetch.mockImplementationOnce(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) }));
    const latitude = 40.7128;
    const longitude = -74.0060;
    await fetchHistoricalData(latitude, longitude);
  });

});

describe('displayHistoricalData function', () => {
  it('should display historical data in a table', () => {
    document.body.innerHTML = `<div id="historical"></div>`;
    const historyData = [
      { date: '2024-05-01', maxTemp: 20, minTemp: 10, rain: 5, shower: 3, snow: 0 },
      { date: '2024-05-02', maxTemp: 22, minTemp: 12, rain: 2, shower: 1, snow: 0 }
    ];
    displayHistoricalData(historyData);
    const tableRows = document.querySelectorAll('#historical tbody tr');
    expect(tableRows.length).toBe(2);
  });
});

describe('createRow function', () => {
  it('should create a table row with data', () => {
    const data = { date: '2024-05-01', maxTemp: 20, minTemp: 10, rain: 5, shower: 3, snow: 0 };
    const rowHTML = createRow(data);
    expect(rowHTML).toContain('<td>2024-05-01</td>');
    expect(rowHTML).toContain('<td>20°C</td>');
    expect(rowHTML).toContain('<td>10°C</td>');
    expect(rowHTML).toContain('<td>5mm</td>');
    expect(rowHTML).toContain('<td>3mm</td>');
    expect(rowHTML).toContain('<td>0cm</td>');
  });
});
