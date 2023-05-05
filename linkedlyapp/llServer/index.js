const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config({ path: '../../.env' });


//create a simple webserver with express
const express = require('express');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/email/:name', (req, res) => {
    res.send(`Hello ${req.params.name}!`);
});


app.get('get/response/score', (req, res) => {
    personData = JSON.parse(req.body);
    res.send('Hello World!');
});


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,

});

const openai = new OpenAIApi(configuration);

async function runCompletion(){
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: "Tell me about yourself: I'm a Data Scientist working at IBM.",
        max_tokens: 100,
    });

    completion.data.choices.forEach((choice, index) => {
        console.log(`Choice ${index + 1}: ${choice.text}`);
    });
}

runCompletion();