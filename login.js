// login.js
import { createAuth0Client } from './auth0Client.js';

const manageToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJZWVVLeWtrVkNIbThETGNfUi1fSCJ9.eyJpc3MiOiJodHRwczovL2Rldi1jejF4ZnJxbHo0Z2J6NjMzLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJISkpTQ2xOZHBPMDV2Uncwb1lYYlNpOWVDdmtLTVVGZEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtY3oxeGZycWx6NGdiejYzMy51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTcxNjEzNjQ2MiwiZXhwIjoxNzE2MjIyODYyLCJzY29wZSI6InJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJISkpTQ2xOZHBPMDV2Uncwb1lYYlNpOWVDdmtLTVVGZCJ9.LMzUhKlzc54fXRWe-8A01zffUqXMeUH4knyl-AGxPXz01YK4bt_XJEBZxDK0xcgQSSFrBITfObFX3XbowU8UHnJ3wgMuV6DUGjq5VRNYkc-reqau7xg5rM6FBAbZjiQVdezvlUJGPBC8E3vGqyUcQfOjNH2MRUELTG6FGP4dtUn8XgBIpX3y_bFQL9T4jkVnqJJqVhP0JKmc8AKON9TYhp3qlG6NbbRgLRlAxL10e-dRYpL0E3yPU_LIh1Dj6pxhYkrRGj8PsCBV1HoXTZg-FVL1_kkbp7I0kZE4KymdxO9qLBpvR8Ls549GCtBUe9KvAOlyy13QXSGKzdaWWMBYQA"

let auth0Client;
let userId;
let metadata;

const handleAuthentication = () => {
  auth0Client.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      auth0Client.client.userInfo(authResult.accessToken, (err, user) => {
        if (user) {
          document.getElementById("addFavorite").style.display="block"
          userId = user.sub;
          metadata = user.metauser_metadata;
          //console.log(metadata)
          displayFavoriteLocations()
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

const addFavoriteLocation = async () => {
  const location = document.getElementById('location').value.trim();
  const domain = "dev-cz1xfrqlz4gbz633.us.auth0.com"

  if (location === '') {
    console.error('Empty location');
    return;
  }

  if (!metadata.favorite_locations) {
    metadata.favorite_locations = [];
  }

  if (metadata.favorite_locations.includes(location)) {
    console.error('Location already exists in favorites');
    return;
  }
  metadata.favorite_locations.push(location)

  var newData={
    "user_metadata": metadata
  }

// Make the PATCH request
axios.patch(`https://${domain}/api/v2/users/${userId}`, newData, {
  headers: {
    'Authorization': `Bearer ${manageToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('User metadata updated successfully:', response.data);
})
.catch(error => {
  console.error('Error updating user metadata:', error.response.data);
});
displayFavoriteLocations()
};

const displayFavoriteLocations = () => {
  const field = document.getElementById("dropdown");
  field.innerHTML = '<option value="">Vyber z oblíbených</option>'
  metadata.favorite_locations.forEach(element => {
    const option = document.createElement("option")
    option.textContent = element
    option.value = element
    field.appendChild(option)
  });
  document.getElementById("dropdown").style.display="block"
};

const login = () => {
  auth0Client.authorize();
};

const logout = () => {
  auth0Client.logout({ returnTo: window.location.origin });
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

export { handleAuthentication, addFavoriteLocation, displayFavoriteLocations, login, logout, initializeAuth0Client };