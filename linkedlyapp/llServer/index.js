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

app.get('/email/:name', async function(req, res){
    console.log(`Hello ${req.params.name}!`);
    // come with variations of email formats with the name and make name lowercase
    // then split first and last name and take out all non-alphanumeric characters
    let name = req.params.name;
    let splitName = name.split("+");
    let first = splitName[0];
    let last = splitName[1];
    let firstLast = first + last;
    let firstDotLast = first + '.' + last;
    let firstDotL = first + '.' + last[0];
    let fLast = first[0] + last;
    let firstL = first + last[0];
    // const apiKey = process.env.HUNTERIO_API_KEY; // replace with your Hunter API key
    // const url = `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(companyName)}&api_key=${apiKey}`;
    // const response = await fetch(url);
    // const data = await response.json();
    res.end(req.params.name);
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
