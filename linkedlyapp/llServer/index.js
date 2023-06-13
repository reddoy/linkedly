const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config({ path: '../../.env' });


//create a simple webserver with express
const express = require('express');
const mongoose = require('mongoose');
// const { run } = require('node:test');
const bodyParser = require('body-parser');
const stringSimilarity = require('string-similarity');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

mongoose.connect("mongodb+srv://doadmin:78q1Aj0px6352kcm@db-mongodb-nyc1-51418-f4c19a18.mongo.ondigitalocean.com/admin?tls=true&authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const userSchema = new mongoose.Schema({
    userid: String,
    firstname: String,
    lastname: String,
    edu: String,
    occup: String,
    goal: String
});

const User = mongoose.model('User', userSchema);

app.use(express.static(__dirname+'/public_html'));

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

app.post('/get/message', async (req, res) => {
    let data = req.body;
    const user = await User.findOne({ userid: data.curUserId });
    console.log(user);
    console.log(data);
    let userFirstName = user.firstname;
    let userEdu = user.edu.toLowerCase();
    let userGoal = user.goal;
    let targetFirstName = data.curName.split(" ")[0];
    let targetSchools = data.schools;
    let targetWork = data.workExperience;
    let targetHeadline = data.curHeadline;
    let targetAbout = data.curAbout;
    let prompt = promptCreator(targetSchools, targetWork, targetHeadline, targetAbout, targetFirstName, userFirstName, userEdu, userGoal);
    let message = await runCompletion(prompt);
    console.log(message);
    res.end(message);
});


function promptCreator(targetSchools, targetWork, targetHeadline, targetAbout, targetFirstName, userFirstName, userEdu, userGoal){
  let sameCollege = false;
  for (let i = 0; i < targetSchools.length; i++) {
      const similarity = targetSchools[i].includes(userEdu);
      console.log(`Similarity between ${targetSchools[i]} and ${userEdu}: ${similarity}`);
      if (similarity) {
          sameCollege = true;
          break;
      }
      
  }
  console.log(`Same college: ${sameCollege}`);
  let prompt = '';
  if (sameCollege) {
    prompt = `Write a peronalized reach out message for Linkedin to ${targetFirstName}.Please provide a response with a 300 character limit. Do not go over this limit.
    Here is some information about ${targetFirstName}:
    ${targetFirstName} is currently a ${targetHeadline}.
    Use my school ${userEdu} slogan to open the message. In this format "<school slogan>! ${targetFirstName}!".
    My goal with ${targetFirstName} is to ${userGoal} include this after the greeting.
    Do not use my name and do not put a closing.`;
  }
  else{
    prompt = `Write a peronalized reach out message for Linkedin to ${targetFirstName}. Please provide a response with a 300 character limit. Do not go over this limit.
    Here is some information about ${targetFirstName}:
    ${targetFirstName} is currently a ${targetHeadline}.
    My goal with ${targetFirstName} is to ${userGoal} include this after the greeting.
    Do not use my name and do not put a closing.`;
  }
   return prompt;
}

app.get('/check/user/:id', async (req, res) => {
    const userid = req.params.id;
    console.log(userid);

    try {
        const user = await User.findOne({ userid: userid });
        if (!user) {
          console.log('User not found');
          res.end('nouser');
        } else {
          console.log('User found');
          res.end('user');
        }
      } catch (err) {
        console.error('Error finding user:', err);
        res.status(500).send('Internal server error');
      }
});


app.post('/create/user', async (req, res) => {
    console.log(req.body);
    const userid = req.body.userId;
    console.log(userid);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const edu = req.body.school;
    const occup = req.body.occupation;
    const goal = req.body.goal;

    const user = new User({
        userid: userid,
        firstname: firstName,
        lastname: lastName,
        edu: edu,
        occup: occup,
        goal: goal,
    });

    try {
        await user.save();  
        res.redirect('chrome-extension://fhbongmeodpnnccflnmomdiebobgpdnm/popup.html');
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(500).send('Internal server error');
    }
});

app.post('/edit/user', async (req, res) => {
  console.log(req.body);
  const userid = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const edu = req.body.school;
  const occup = req.body.occupation;
  const goal = req.body.goal;

  try {
    const user = await User.findOneAndUpdate(
      { userid: userid },
      {
        firstname: firstName,
        lastname: lastName,
        edu: edu,
        occup: occup,
        goal: goal,
      },
      { new: true } // return the updated document
    );
    if (user) {
      console.log('User updated:', user);
      res.status(200).send('User updated');
    } else {
      console.log('User not found');
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Internal server error');
  }
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,

});

const openai = new OpenAIApi(configuration);

async function runCompletion(sentPrompt){
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: sentPrompt,
        max_tokens: 75,
    });
    let curChoices = [];
    const choices = completion.data.choices.map((choice, index) => {
        curChoices.push(choice.text);
    });
    console.log(curChoices);
    return curChoices[0];
}