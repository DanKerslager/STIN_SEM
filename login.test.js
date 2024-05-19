// login.test.js
import createAuth0Client from './auth0Client';
import { initializeAuth0Client, handleAuthentication, login, logout, getUserInfo } from './login.js';

jest.mock('./auth0Client', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    parseHash: jest.fn(),
    authorize: jest.fn(),
    logout: jest.fn(),
    client: {
      userInfo: jest.fn(),
    },
  })),
}));

describe('Auth0 Login', () => {
  let auth0Client;

  beforeEach(() => {
    // Reset the mock implementation before each test
    auth0Client = createAuth0Client();
    jest.clearAllMocks();

    // Set up the HTML elements required for the tests
    document.body.innerHTML = `
      <button id="login">Login</button>
      <button id="logout">Logout</button>
      <div id="user"></div>
    `;

    // Initialize the Auth0 client with the mock
    initializeAuth0Client(auth0Client);
  });

  test('should handle login click', () => {
    document.getElementById('login').click();
    expect(auth0Client.authorize).toHaveBeenCalled();
  });

  test('should handle logout click', () => {
    document.getElementById('logout').click();
    expect(auth0Client.logout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });

  test('should handle authentication', () => {
    const authResult = {
      accessToken: 'testAccessToken',
      idToken: 'testIdToken',
    };
    auth0Client.parseHash.mockImplementation(callback => callback(null, authResult));
    handleAuthentication();
    expect(auth0Client.client.userInfo).toHaveBeenCalledWith('testAccessToken', expect.any(Function));
  });
  test('should handle authentication error', () => {
    const error = new Error('Authentication error');
    auth0Client.parseHash.mockImplementation(callback => callback(error));
    console.error = jest.fn(); // Mock console.error
    handleAuthentication();
    expect(console.error).toHaveBeenCalledWith('Authentication error:', error);
  });
  
  test('should handle user info error', () => {
    const error = new Error('User info error');
    const authResult = {
      accessToken: 'testAccessToken',
      idToken: 'testIdToken',
    };
    auth0Client.parseHash.mockImplementation(callback => callback(null, authResult));
    auth0Client.client.userInfo.mockImplementation((accessToken, callback) => callback(error));
    console.error = jest.fn(); // Mock console.error
    handleAuthentication();
    expect(console.error).toHaveBeenCalledWith('User info error:', error);
  });
  
  test('should get user info', () => {
    const user = { name: 'Test User' };
    const accessToken = 'testAccessToken';
    getUserInfo(accessToken);
    expect(auth0Client.client.userInfo).toHaveBeenCalledWith(accessToken, expect.any(Function));
  });

  test('should handle user info', () => {
    const user = { name: 'Test User' };
    const accessToken = 'testAccessToken';
    const callback = jest.fn();
    
    // Mock console.log
    console.log = jest.fn();
    
    getUserInfo(accessToken);
    auth0Client.client.userInfo.mock.calls[0][1](null, user); // Call the callback with user
    
    // Expect console.log to be called with the correct arguments
    expect(console.log).toHaveBeenCalledWith('User info:', user);
  });
  
  test('should handle missing authResult properties', () => {
    const authResult = null; // Simulate missing authResult
    const error = new Error('Authentication error');
    auth0Client.parseHash.mockImplementation(callback => callback(error, authResult));
    console.error = jest.fn(); // Mock console.error
    handleAuthentication();
    expect(console.error).toHaveBeenCalledWith('Authentication error:', error);
  });
  
  test('should handle getUserInfo error', () => {
    const error = new Error('User info error');
    const accessToken = 'testAccessToken';
    getUserInfo(accessToken);
    auth0Client.client.userInfo.mock.calls[0][1](error, null); // Call the callback with error
    expect(console.error).toHaveBeenCalledWith('User info error:', error);
  });

});


