// netlify/functions/api.js

//example call: curl -X POST https://pocasitest.netlify.app/.netlify/functions/api -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"password123\",\"location\":\"New York\"}"


const { AuthenticationClient } = require('auth0');

const auth0 = new AuthenticationClient({
  domain: 'dev-cz1xfrqlz4gbz633.us.auth0.com',
  clientId: 'GcpBuKna5egJWpvRWTEfbKFte1mywkA8',
  clientSecret: 'fH6s_Tk7kcbDNzH1BU2wBzlbd1--CCmIaVfv4LZNSjljZrSDdVx7_dXdGqIqnzFM'
});

exports.handler = async function(event, context) {
    try {
      const body = JSON.parse(event.body);
  
      // Extract user data from the body
      const { email, password, location } = body;
  
      // Check if all required fields are provided
      if (!email || !password || !location) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing required fields' }),
        };
      }
  
      // Authenticate user against Auth0
      const authResult = await auth0.passwordGrant({
        username: email,
        password: password,
        audience: 'YOUR_AUTH0_API_AUDIENCE',
        scope: 'openid'
      });
  
      // Example response
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Authentication successful', user: authResult.user }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Error: ${error.message}` }),
      };
    }
  };