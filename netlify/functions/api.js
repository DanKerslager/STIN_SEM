// netlify/functions/api.js

//example call: curl -X POST https://pocasitest.netlify.app/.netlify/functions/api -H "Content-Type: application/json" -d "{\"email\":\"dan.kerslager@tul.cz\",\"password\":\"TestTest1\",\"location\":\"New York\"}"

const { AuthenticationClient } = require('auth0');
const axios = require('axios');

const auth0 = new AuthenticationClient({
    domain: 'dev-cz1xfrqlz4gbz633.us.auth0.com',
    clientId: 'HJJSClNdpO05vRw0oYXbSi9eCvkKMUFd',
    clientSecret: 'Ro_meg_dZnC2No76c61tHeGA46CdSaThHNZ-5AiHdw22GPbTpLFe_kAsaFmC1ohQ'
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

        // Use Resource Owner Password Grant to authenticate user
        const response = await axios.post(`https://${auth0.domain}/oauth/token`, {
            grant_type: 'password',
            username: email,
            password: password,
            audience: 'https://dev-cz1xfrqlz4gbz633.us.auth0.com/api/v2/',
            client_id: auth0.clientId,
            client_secret: auth0.clientSecret,
            scope: 'openid'
        });

        const authResult = response.data;

        // Example response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Authentication successful', token: authResult.access_token }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `Error: ${error.message}` }),
        };
    }
};

