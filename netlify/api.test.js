const axios = require('axios');
const { handler } = require('./functions/api');

jest.mock('axios'); // Mock Axios module

// Mock utility functions
jest.mock('./utils.js', () => ({
    getLocation: jest.fn().mockResolvedValue({ lat: 40.7128, lon: -74.0060 }), // Mock coordinates for New York
    getWeather: jest.fn().mockResolvedValue({ temperature: 72, conditions: 'Sunny' }), // Mock weather data
    fetchHistoricalData: jest.fn().mockResolvedValue({ averageTemperature: 68, conditions: 'Partly Cloudy' }) // Mock historical data
}));

describe('API Endpoint Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        const event = {
            body: JSON.stringify({}) // Missing required fields
        };
        const context = {};

        const response = await handler(event, context);

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body).message).toBe('Missing required fields');
    });

    it('should return 500 if Auth0 response is not received', async () => {
        axios.post.mockRejectedValue({ request: true }); // Simulate no response received

        const event = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password',
                location: 'New York'
            })
        };
        const context = {};

        const response = await handler(event, context);

        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body).message).toBe('Error: No response received from Auth0');
    });

    it('should return 500 if an error occurs during request setup', async () => {
        axios.post.mockRejectedValue(new Error('Error during request setup')); // Simulate error during request setup

        const event = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password',
                location: 'New York'
            })
        };
        const context = {};

        const response = await handler(event, context);

        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body).message).toBe('Error: Error during request setup');
    });

    it('should return the appropriate error response when the server responds with a non-2xx status code', async () => {
        const errorResponse = {
            status: 401,
            data: {
                error: 'invalid_credentials',
                error_description: 'Invalid username or password'
            }
        };

        axios.post.mockRejectedValue({ response: errorResponse }); // Simulate error response from the server

        const event = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password',
                location: 'New York'
            })
        };
        const context = {};

        const response = await handler(event, context);

        expect(response.statusCode).toBe(401);
        expect(JSON.parse(response.body).message).toBe('Error: Invalid username or password');
    });

    it('should return the appropriate response when authentication is successful', async () => {
        // Mock successful response from Auth0
        axios.post.mockResolvedValue({
            data: {
                access_token: 'mock_access_token',
                token_type: 'Bearer'
            }
        });

        const event = {
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password',
                location: 'New York'
            })
        };
        const context = {};

        const response = await handler(event, context);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Authentication successful',
            token: {
                current: { temperature: 72, conditions: 'Sunny' },
                historical: { averageTemperature: 68, conditions: 'Partly Cloudy' }
            }
        });
    });

    // Add more test cases to cover different scenarios
});
