import { writeText, getLocation, getWeather, displayIcon, fetchHistoricalData, displayHistoricalData, createRow } from "./index.js";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

console.error = jest.fn(); // Mock console.error


describe('getLocation function', () => {
  it('should fetch data from geoAPI with the provided location', async () => {
    await getLocation('New York');
    expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/geo/1.0/direct?q=New York&limit=1&appid=3034449191d7e019ed5ee40277f84796');
  });
});

describe('displayIcon function', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="imgContainer"></div>';
  });

  it('should create and append img element with correct src', () => {
    const code = '01d'; // Example weather code
    const imgUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;
    displayIcon(code);
    const imgElement = document.querySelector('#imgContainer img');
    const src = imgElement.src;
    expect(imgElement).toBeTruthy();
    expect(src).toBe(imgUrl);
  });
});

describe('getWeather function', () => {
  it('should fetch weather data using latitude and longitude', async () => {
    await getWeather([40.7128, -74.0060]);
    expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.006&appid=3034449191d7e019ed5ee40277f84796');
  });

});

describe('fetchHistoricalData function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch historical weather data', async () => {
    const mockData = {
      daily: [
        { time: '2024-05-01', temperature_2m_max: 20, temperature_2m_min: 10, rain_sum: 5, showers_sum: 3, snowfall_sum: 0 },
        { time: '2024-05-02', temperature_2m_max: 22, temperature_2m_min: 12, rain_sum: 2, showers_sum: 1, snowfall_sum: 0 }
      ]
    };
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) }));
    await fetchHistoricalData([40.7128, -74.0060]);
    expect(fetch).toHaveBeenCalledTimes(7);
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
