const Auth0_domain = "dev-cz1xfrqlz4gbz633.us.auth0.com";
const Auth0_id = "GcpBuKna5egJWpvRWTEfbKFte1mywkA8";

var auth0 = new auth0.WebAuth({
  domain: Auth0_domain,
  clientID: Auth0_id,
  redirectUri: window.location.origin,
  responseType: 'token id_token',
  scope: 'openid profile email',
});

const handleAuthentication = () => {
auth0.parseHash((err, authResult) => {
  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    auth0.client.userInfo(authResult.accessToken, (err, user) => {
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
  auth0.authorize();
};

const logout = () => {
  // Redirect to logout endpoint
  auth0.logout({ returnTo: window.location.origin });
};

const getUserInfo = () => {
  // Get user information
  auth0.client.userInfo(authResult.accessToken, (err, user) => {
    if (user) {
      // Display user information
      console.log('User info:', user);
    } else if (err) {
      // Handle error
      console.error('User info error:', err);
    }
  });
};

window.onload = () => {
  document.getElementById('login').addEventListener('click', login);
  document.getElementById('logout').addEventListener('click', logout);
  handleAuthentication();
};