// auth0Client.js
const Auth0_domain = "dev-cz1xfrqlz4gbz633.us.auth0.com";
const Auth0_secret = "fH6s_Tk7kcbDNzH1BU2wBzlbd1--CCmIaVfv4LZNSjljZrSDdVx7_dXdGqIqnzFM"

const createAuth0Client = () => {
  return new auth0.WebAuth({
    domain: Auth0_domain,
    clientID: "GcpBuKna5egJWpvRWTEfbKFte1mywkA8",
    redirectUri: window.location.origin,
    audience: 'https://dev-cz1xfrqlz4gbz633.us.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  });
};

export {createAuth0Client};
