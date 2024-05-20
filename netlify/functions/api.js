// netlify/functions/api.js
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
  
      // Example response
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Received user data: ${email}, ${password}, ${location}` }),
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: `Error parsing JSON: ${error.message}` }),
      };
    }
  };
  