// login.js
import createAuth0Client from './auth0Client.js';

let auth0Client;
let USER

const handleAuthentication = () => {
  auth0Client.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      auth0Client.client.userInfo(authResult.accessToken, (err, user) => {
        if (user) {
          document.getElementById("addFavorite").style.display="block"
          USER = authResult;
          console.log(USER)
          document.getElementById('user').textContent = `Hello, ${user.name}`;
          fetchFavoriteLocations(authResult.accessToken); // Fetch favorite locations after successful authentication
        } else if (err) {
          console.error('User info error:', err);
        }
      });
    } else if (err) {
      console.error('Authentication error:', err);
    }
  });
};

const addFavoriteLocation = async () => {
  const location = document.getElementById('location').value.trim();
  const accessToken = USER.accessToken;
  if (location === '') {
    console.error('Empty location');
    return;
  }

};


const fetchFavoriteLocations = (accessToken) => {
  auth0Client.client.userInfo(accessToken, (err, user) => {
    if (user) {
      const favoriteLocations = user.metauser_metadata.favorite_locations
      displayFavoriteLocations(favoriteLocations);
    } else if (err) {
      console.error('User info error:', err);
    }
  });
};

const displayFavoriteLocations = (locations) => {
  const field = document.getElementById("dropdown");
  locations.forEach(element => {
    const option = document.createElement("option")
    option.textContent = element
    option.value = element
    field.appendChild(option)
  });
  document.getElementById("dropdown").style.display="block"
  console.log(locations);
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

  document.getElementById('addFavorite').addEventListener('click', addFavoriteLocation);
  document.getElementById('login').addEventListener('click', login);
  document.getElementById('logout').addEventListener('click', logout);
  document.getElementById('dropdown').addEventListener('change', function(){
    document.getElementById('location').value = this.value
  })
  handleAuthentication();
};

window.onload = () => initializeAuth0Client();

export { handleAuthentication, login, logout, getUserInfo, initializeAuth0Client };
