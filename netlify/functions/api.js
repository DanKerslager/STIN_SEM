// netlify/functions/api.js

//example call: curl -X POST https://pocasitest.netlify.app/.netlify/functions/api -H "Content-Type: application/json" -d "{\"email\":\"dan.kerslager@tul.cz\",\"password\":\"TestTest1\",\"location\":\"New York\"}"

const axios = require('axios');
const { getLocation, getWeather, fetchHistoricalData } = require('../utils.js')

const auth0Config = {
    domain: 'dev-cz1xfrqlz4gbz633.us.auth0.com',
    clientId: 'HJJSClNdpO05vRw0oYXbSi9eCvkKMUFd',
    clientSecret: 'Ro_meg_dZnC2No76c61tHeGA46CdSaThHNZ-5AiHdw22GPbTpLFe_kAsaFmC1ohQ',
    connection: 'Username-Password-Authentication'  // Update with your connection name
};

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
        const response = await axios.post(`https://${auth0Config.domain}/oauth/token`, {
            grant_type: 'password',
            username: email,
            password: password,
            audience: 'https://dev-cz1xfrqlz4gbz633.us.auth0.com/api/v2/',
            client_id: auth0Config.clientId,
            client_secret: auth0Config.clientSecret,
            scope: 'openid',
            realm: auth0Config.connection  // Specify the connection here
        });

        const authResult = response.data;
        const coordinates = await getLocation(location)
        const weatherData = await getWeather(coordinates)
        const historicalData = await fetchHistoricalData(coordinates)

        // Example response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Authentication successful', token: weatherData }),
        };
    } catch (error) {
        console.error('Error authenticating with Auth0:', error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return {
                statusCode: error.response.status,
                body: JSON.stringify({ message: `Error: ${error.response.data.error_description || error.response.data.error}` }),
            };
        } else if (error.request) {
            // The request was made but no response was received
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error: No response received from Auth0' }),
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            return {
                statusCode: 500,
                body: JSON.stringify({ message: `Error: ${error.message}` }),
            };
        }
    }
};
