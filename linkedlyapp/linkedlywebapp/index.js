const node = require('node');
const fetch = require('node-fetch');
const express = require('express');

const openaiApiKey = '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';
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.send('Hello World!');
});


let name = req.body.name;

const prompt = "Once upon a time";

const params = {
"model": "text-davinci-002",
"temperature": 0.7,
"max_tokens": 60,
"top_p": 1,
"frequency_penalty": 0,
"presence_penalty": 0
};

fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
method: 'POST',
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiApiKey}`,
},
body: JSON.stringify({
    prompt,
    ...params,
}),
})
.then(response => response.json())
.then(data => console.log(data.choices[0].text))
.catch(error => console.error(error));

