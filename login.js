// login.js
import createAuth0Client from './auth0Client.js';

let auth0Client;

const handleAuthentication = () => {
  auth0Client.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      auth0Client.client.userInfo(authResult.accessToken, (err, user) => {
        if (user) {
          document.getElementById('user').textContent = `Hello, ${user.name}`;
        } else if (err) {
          console.error('User info error:', err);
        }
      });
    } else if (err) {
      console.error('Authentication error:', err);
    }
  });
};

const login = () => {
  auth0Client.authorize();
};

const logout = () => {
  auth0Client.logout({ returnTo: window.location.origin });
};

const getUserInfo = (accessToken) => {
  auth0Client.client.userInfo(accessToken, (err, user) => {
    if (user) {
      console.log('User info:', user);
    } else if (err) {
      console.error('User info error:', err);
    }
  });
};

const initializeAuth0Client = (client) => {
  auth0Client = client || createAuth0Client();

  document.getElementById('login').addEventListener('click', login);
  document.getElementById('logout').addEventListener('click', logout);
  handleAuthentication();
};

window.onload = () => initializeAuth0Client();

export { handleAuthentication, login, logout, getUserInfo, initializeAuth0Client };
