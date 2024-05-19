// index.test.js

// Import the functions to be tested
import { writeText, getLocation, getWeather, displayIcon } from "./index.js"

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
});

describe('getWeather function', () => {
  it('should fetch weather data using latitude and longitude', async () => {
    await getWeather(40.7128, -74.0060);
    expect(fetch).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.006&appid=3034449191d7e019ed5ee40277f84796');
  });
});

describe('displayIcon function', () => {
  it('should create an img element with the correct src', () => {
    document.body.innerHTML = '<div id="imgContainer"></div>';
    const code = '01d';
    displayIcon(code);
    const imgElement = document.querySelector('#imgContainer img');
    expect(imgElement.src).toBe('https://openweathermap.org/img/wn/01d@2x.png');
  });

  describe('getLocation function', () => {
    it('should handle error when fetch fails', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
      console.error = jest.fn(); // Mock console.error
      await getLocation('New York');
      const receivedError = console.error.mock.calls[0][0];
      expect(receivedError.message).toBe('Network error');
    });
  });
  
  describe('getWeather function', () => {
    it('should handle error when fetch fails', async () => {
      fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
      console.error = jest.fn(); // Mock console.error
      await getWeather(40.7128, -74.0060);
      const receivedError = console.error.mock.calls[0][0];
      expect(receivedError.message).toBe('Network error');
    });
  });

});
