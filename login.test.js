import { createAuth0Client } from './auth0Client.js';
import {
  handleAuthentication,
  addFavoriteLocation,
  displayFavoriteLocations,
  login,
  logout,
  initializeAuth0Client
} from './login.js';

// Mock dependencies
jest.mock('axios');
jest.mock('./auth0Client.js');

// Mock elements
document.body.innerHTML = `
  <div>
    <button id="addFavorite"></button>
    <button id="login"></button>
    <button id="logout"></button>
    <select id="dropdown"></select>
    <input id="location" value="">
    <div id="user"></div>
  </div>
`;

// Mock axios on window
window.axios = {
  post: jest.fn().mockName('axiosPost'),
  patch: jest.fn().mockResolvedValue({ data: {} }) // Mocking the resolved value for axios.patch
};

describe('Auth0 Client', () => {
  let mockAuth0Client;

  beforeEach(() => {
    mockAuth0Client = {
      parseHash: jest.fn(),
      client: {
        userInfo: jest.fn()
      },
      authorize: jest.fn(),
      logout: jest.fn()
    };
    createAuth0Client.mockReturnValue(mockAuth0Client);
    initializeAuth0Client(mockAuth0Client);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handleAuthentication - successful authentication', async () => {
    const authResult = {
      accessToken: 'testAccessToken',
      idToken: 'testIdToken'
    };
    const user = {
      name: 'John Doe',
      metauser_metadata: {
        favorite_locations: ['Location1', 'Location2']
      }
    };

    mockAuth0Client.parseHash.mockImplementation(callback => callback(null, authResult));
    mockAuth0Client.client.userInfo.mockImplementation((token, callback) => callback(null, user));

    await handleAuthentication();

    expect(mockAuth0Client.parseHash).toHaveBeenCalled();
    expect(mockAuth0Client.client.userInfo).toHaveBeenCalledWith('testAccessToken', expect.any(Function));
    expect(document.getElementById('addFavorite').style.display).toBe('block');
    expect(document.getElementById('user').textContent).toBe('Hello, John Doe');
  });

  test('handleAuthentication - error in authentication', async () => {
    const error = new Error('Auth error');

    mockAuth0Client.parseHash.mockImplementation(callback => callback(error, null));

    console.error = jest.fn();

    await handleAuthentication();

    expect(mockAuth0Client.parseHash).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Authentication error:', error);
  });
  

  test('displayFavoriteLocations - displays favorite locations', () => {
    const favoriteLocations = ['Location1', 'Location2'];
    global.metadata = { favorite_locations: favoriteLocations };

    displayFavoriteLocations();

    const dropdown = document.getElementById('dropdown');
    expect(dropdown.style.display).toBe('block');
    expect(dropdown.children.length).toBe(2);
    expect(dropdown.children[0].textContent).toBe('Location1');
    expect(dropdown.children[1].textContent).toBe('Location2');
  });

  test('login - calls auth0Client.authorize', () => {
    login();

    expect(mockAuth0Client.authorize).toHaveBeenCalled();
  });

  test('logout - calls auth0Client.logout', () => {
    logout();

    expect(mockAuth0Client.logout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });
});
