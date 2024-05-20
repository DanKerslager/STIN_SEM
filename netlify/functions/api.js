// netlify/functions/api.js

//example call: curl -X POST https://pocasitest.netlify.app/.netlify/functions/api -H "Content-Type: application/json" -d "{\"email\":\"dan.kerslager@tul.cz\",\"password\":\"TestTest1\",\"location\":\"New York\"}"


const auth0 = require('auth0-js');

const webAuth = new auth0.WebAuth({
    domain: 'dev-cz1xfrqlz4gbz633.us.auth0.com',
    clientID: 'HJJSClNdpO05vRw0oYXbSi9eCvkKMUFd',
    responseType: 'token',
    redirectUri: "https://pocasitest.netlify.app/callback", // Replace with your actual callback URL
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

        // Authenticate user using Auth0
        webAuth.login({
            realm: 'Username-Password-Authentication', // This is the default database connection name in Auth0
            username: email,
            password: password
        }, (err, authResult) => {
            if (err) {
                // Authentication failed, handle error
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: `Error: ${err.description}` }),
                };
            } else {
                // Authentication successful, handle result
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Authentication successful', user: authResult }),
                };
            }
        });
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `Error: ${error.message}` }),
        };
    }
};
