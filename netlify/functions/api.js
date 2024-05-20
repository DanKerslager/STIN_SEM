// netlify/functions/api.js
exports.handler = async function(event, context) {
    // Parse the request body
    const body = JSON.parse(event.body);
  
    // Extract data from the body
    const { key } = body;
  
    // Check if the key is provided
    if (!key) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing key' }),
      };
    }
  
    // Example response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Received key: ${key}` }),
    };
  };
  