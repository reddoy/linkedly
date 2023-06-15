const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config({ path: '../../.env' });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
  goal: String,
  paid: String,
  tries: Number,
});

const emailDomainSchema = new mongoose.Schema({
  companyname: String,
  domain: String,
});

const User = mongoose.model('User', userSchema);
const EmailDomain = mongoose.model('EmailDomain', emailDomainSchema);

app.use(express.static(__dirname+'/public_html'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/get/message', async (req, res) => {
    let targetData = req.body;
    console.log(targetData);
    const user = await User.findOne({ userid: targetData.curUserId });
    const userStatus = checkPaidUserTriesMain(user);
    const userTag = userStatus[0];
    if (userTag == 'ntl') {
      res.json(['ntl', 0]);
    }
    else if(userTag == 'ntlnp'){
      res.json(['ntlnp', 0]);
    }
    else if(userTag == 'usertl'){
      let popupFills = emailAndMessageMain(user, targetData);
      let message = popupFills[0];
      let emailOptions = popupFills[1];
      res.json(['usertl', userStatus[1], message, emailOptions]);
    }
    else if(userTag == 'error'){
      res.json(['error', 0]);
    }
});


function checkPaidUserTriesMain(user){
  if (checkIfPaidUser(user) == 'paiduser') {
    let userTriesLeft = user.tries;
    if (userTriesLeft > 0) {
      user.tries = userTriesLeft - 1;
      user.save();
      return ['usertl', userTriesLeft - 1];
    }else{
      return ['ntl'];
    }
  }
  else if (checkIfPaidUser(user) == 'notpaiduser'){
    let userTriesLeft = user.tries;
    if (userTriesLeft > 0) {
      user.tries = userTriesLeft - 1;
      user.save();
      return ['usertl', userTriesLeft - 1];
    }else{
      return ['ntlnp'];
    }
  }
  else{
    return ['error'];
  }
}

async function emailAndMessageMain(user, data){
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
  let generatedEmails = getEmails(data.curName.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '+'));
  return [message, generatedEmails]; 
}

async function getEmails(name,companyName){
  console.log(`Hello ${name}!`);
  let splitName = name.split("+");
  let first = splitName[0];
  let last = splitName[1];

  let doesDomainExist = await EmailDomain.findOne({ companyname: companyName });
  let domain;
  if (doesDomainExist) {
    domain = doesDomainExist.domain;
  }else{
  // const apiKey = process.env.HUNTERIO_API_KEY; // replace with your Hunter API key
  // const url = `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(companyName)}&api_key=${apiKey}`;
  // const response = await fetch(url);
  // const domain = await response.json();
  }

  let jsonNames = [
    splitName[0] + domain,
    splitName[1],
    first + last,
    first + '.' + last,
    first + '.' + last[0],
    first[0] + last,
    first + last[0]
];
  res.end(JSON.stringify(jsonNames));
}

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
        paid: 'false',
        tries: 15
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