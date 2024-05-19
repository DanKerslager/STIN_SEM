// auth0Client.js
const Auth0_domain = "dev-cz1xfrqlz4gbz633.us.auth0.com";
const Auth0_id = "GcpBuKna5egJWpvRWTEfbKFte1mywkA8";

const createAuth0Client = () => {
  return new auth0.WebAuth({
    domain: Auth0_domain,
    clientID: Auth0_id,
    redirectUri: window.location.origin,
    responseType: 'token id_token',
    scope: 'openid profile email',
  });
};

export default createAuth0Client;
