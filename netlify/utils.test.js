import { getLocation, getWeather, fetchHistoricalData } from "./utils.js";

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
