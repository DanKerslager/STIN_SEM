const Auth0_domain = "dev-cz1xfrqlz4gbz633.us.auth0.com"
const Auth0_id = "GcpBuKna5egJWpvRWTEfbKFte1mywkA8"

import createAuth0Client from 'https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js';

let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: Auth0_domain,
    client_id: Auth0_id,
    redirect_uri: window.location.origin,
  });
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin,
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin,
  });
};

const isAuthenticated = async () => {
  return await auth0.isAuthenticated();
};

const getUser = async () => {
  const user = await auth0.getUser();
  console.log(user);
  return user;
};

const handleAuth = async () => {
  const isAuth = await isAuthenticated();
  if (isAuth) {
    const user = await getUser();
    document.getElementById('user').textContent = `Hello, ${user.name}`;
  }
};

window.onload = async () => {
  await configureClient();
  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/');
  }
  await handleAuth();
};

document.getElementById('login').addEventListener('click', login);
document.getElementById('logout').addEventListener('click', logout);