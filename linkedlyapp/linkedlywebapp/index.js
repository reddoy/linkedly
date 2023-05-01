
const axios = require('axios');

// Your API key
const API_KEY = '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';
console.log(API_KEY);

// API endpoint
const API_URL = 'https://api.openai.com/v1/engines';

// Prompt text to be completed by the model
const prompt = 'Hello, World!';

// Request parameters
const data = {
    prompt: prompt,
    max_tokens: 50,
    temperature: 0.5
};

// API request headers
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
};

// Send a POST request to the API endpoint
axios.post(API_URL, data, { headers })
    .then(response => {
        // Handle the API response
        console.log(response.data.choices[0].text);
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
