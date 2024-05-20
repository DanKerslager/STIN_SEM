// netlify/functions/api.js

//example call: curl -X POST https://pocasitest.netlify.app/.netlify/functions/api -H "Content-Type: application/json" -d "{\"email\":\"dan.kerslager@tul.cz\",\"password\":\"TestTest1\",\"location\":\"New York\"}"

const { AuthenticationClient } = require('auth0');

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

        // Authenticate user against Auth0
        const authResult = await auth0.passwordGrant({
            username: email,
            password: password,
            audience: 'https://dev-cz1xfrqlz4gbz633.us.auth0.com/api/v2/',
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
