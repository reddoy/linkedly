const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config({ path: '../../.env' });


//create a simple webserver with express
const express = require('express');
const mongoose = require('mongoose');
const { run } = require('node:test');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

mongoose.connect('mongodb://localhost/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const userSchema = new mongoose.Schema({
    userid: String,
    name: String,
    email: String,
    password: String,
    edu: String,
});

const User = mongoose.model('User', userSchema);

app.use(express.static(__dirname+'/public_html'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/get/loginpage', (req, res) => {
});

app.get('/email/:name', async function(req, res){
    console.log(`Hello ${req.params.name}!`);
    // come with variations of email formats with the name and make name lowercase
    // then split first and last name and take out all non-alphanumeric characters

    let name = req.params.name;
    let splitName = name.split("+");
    let first = splitName[0];
    let last = splitName[1];
    let jsonNames = [
        splitName[0],
        splitName[1],
        first + last,
        first + '.' + last,
        first + '.' + last[0],
        first[0] + last,
        first + last[0]
    ];

    // const apiKey = process.env.HUNTERIO_API_KEY; // replace with your Hunter API key
    // const url = `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(companyName)}&api_key=${apiKey}`;
    // const response = await fetch(url);
    // const data = await response.json();
    res.end(JSON.stringify(jsonNames));
});


app.get('get/response/score', (req, res) => {
    personData = JSON.parse(req.body);
    res.send('Hello World!');
});

app.get('/get/message/:data', (req, res) => {
    let data = JSON.parse(req.params.data);
    console.log(data);
    let prompt = `My name is Rohan OMalley, write me a reach out message
                to ${data.curName}, they work at ${data.curCompany} as a ${data.curTitle}
                My goal is to ${data.curGoal}. Make it under 300 characters. Use the person I am reaching out to first name in the greeting'`;
    runCompletion(prompt);
    res.end('ran message');
});

app.get('/check/user', (req, res) => {
    const userid = req.params.userid;

    User.findOne({ userid: userid }, (err, user) => {
      if (err) {
        console.error('Error finding user:', err);
        res.status(500).send('Internal server error');
      } else if (!user) {
        res.end('nouser');
      } else {
        res.json(user);
      }
    });
});


app.get('/create/user', (req, res) => {
    const userid = req.params.userid;
    const name = req.params.name;
    const email = req.params.email;
    const password = req.params.password;
    const edu = req.params.edu;

    const user = new User({
        userid: userid,
        name: name,
        email: email,
        password: password,
        edu: edu,
    });

    user.save((err) => {
        if (err) {
            console.error('Error saving user:', err);
            res.status(500).send('Internal server error');
        } else {
            res.end('User saved');
        }
    });
});



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,

});

const openai = new OpenAIApi(configuration);

async function runCompletion(sentPrompt){
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: sentPrompt,
        max_tokens: 100,
    });

    completion.data.choices.forEach((choice, index) => {
        console.log(`Choice ${index + 1}: ${choice.text}`);
    });
}
