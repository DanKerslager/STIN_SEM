// auth0Client.test.js

import { createAuth0Client } from './auth0Client';

// Mocking the auth0 library
window.auth0 = {
  WebAuth: jest.fn().mockImplementation(() => {
    // Mock implementation of the WebAuth class constructor
  })
};

describe('createAuth0Client', () => {
  test('returns an instance of auth0.WebAuth', () => {
    const auth0Client = createAuth0Client();
    expect(auth0Client).toBeInstanceOf(window.auth0.WebAuth);
  });

  test('initializes auth0.WebAuth with correct parameters', () => {
    const expectedConfig = {
      domain: 'dev-cz1xfrqlz4gbz633.us.auth0.com',
      clientID: 'GcpBuKna5egJWpvRWTEfbKFte1mywkA8',
      redirectUri: window.location.origin,
      audience: 'https://dev-cz1xfrqlz4gbz633.us.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid profile email'
    };
    const auth0Client = createAuth0Client();
    expect(window.auth0.WebAuth).toHaveBeenCalledWith(expectedConfig);
  });
});
