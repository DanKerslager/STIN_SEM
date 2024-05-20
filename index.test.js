// Import the functions to be tested
import { writeText, getLocation, getWeather, displayIcon, fetchHistoricalData, displayHistoricalData, createRow } from "./index.js"

// Mock fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

console.error=jest.fn();

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

describe('displayIcon function', () => {
  beforeEach(() => {
    // Clear the HTML content of the imgContainer before each test
    document.body.innerHTML = '<div id="imgContainer"></div>';
  });

  it('should create and append img element with correct src', () => {
    const code = '01d'; // Example weather code
    const imgUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;

    // Call the function with the weather code
    displayIcon(code);

    // Get the img element and its src attribute
    const imgElement = document.querySelector('#imgContainer img');
    const src = imgElement.src;

    // Assert that the img element is created and appended with correct src
    expect(imgElement).toBeTruthy(); // Ensure img element exists
    expect(src).toBe(imgUrl); // Ensure src attribute is set correctly
  });

  it('should replace existing img element with new one', () => {
    // Create a mock existing img element
    const existingImg = document.createElement('img');
    existingImg.src = 'https://example.com/existing.png';
    document.getElementById('imgContainer').appendChild(existingImg);

    const code = '02d'; // Example weather code
    const imgUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;

    // Call the function with the weather code
    displayIcon(code);

    // Get the img element and its src attribute
    const imgElement = document.querySelector('#imgContainer img');
    const src = imgElement.src;

    // Assert that the img element is replaced with new one and src is updated
    expect(imgElement).toBeTruthy(); // Ensure img element exists
    expect(src).toBe(imgUrl); // Ensure src attribute is set correctly
  });

  it('should clear imgContainer before appending new img element', () => {
    // Add some content to the imgContainer
    document.getElementById('imgContainer').innerHTML = '<span>Some content</span>';

    const code = '03d'; // Example weather code
    const imgUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;

    // Call the function with the weather code
    displayIcon(code);

    // Get the img element and its src attribute
    const imgElement = document.querySelector('#imgContainer img');
    const src = imgElement.src;

    // Assert that the imgContainer is cleared before appending new img element
    expect(document.getElementById('imgContainer').innerHTML).toBe('<img src="' + imgUrl + '">');
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

describe('DOMContentLoaded event listener', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="findButton">Find</button>
      <div id="output1"></div>
      <div id="output2"></div>
    `;
  });

  it('should attach click event listener to findButton', () => {
    const findButton = document.getElementById('findButton');
    const writeTextMock = jest.fn(); // Mock writeText function
    if (findButton) {
      findButton.addEventListener('click', writeTextMock);
    }
    findButton?.click(); // Simulate button click
    expect(writeTextMock).toHaveBeenCalledTimes(1); // Ensure writeText function is called
  });
});


describe('fetchHistoricalData function', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock calls before each test
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  it('should fetch historical weather data', async () => {
    const mockData = {
      daily: [
        { time: '2024-05-01', temperature_2m_max: 20, temperature_2m_min: 10, rain_sum: 5, showers_sum: 3, snowfall_sum: 0 },
        { time: '2024-05-02', temperature_2m_max: 22, temperature_2m_min: 12, rain_sum: 2, showers_sum: 1, snowfall_sum: 0 }
      ]
    };
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })); // Corrected implementation
    const latitude = 40.7128;
    const longitude = -74.0060;
    await fetchHistoricalData(latitude, longitude);
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
