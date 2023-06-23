const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config({ path: '../../.env' });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';


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
  purpose: String,
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

const stripe = new Stripe('');
const endpointSecret = '';

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.log('this is the error' + err.message);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'charge.captured':
      const chargeCaptured = event.data.object;
      // Then define and call a function to handle the event charge.captured
      break;
    // ... handle other event types
    case 'checkout.session.completed':
      console.log(event.data.object.client_reference_id);
      let user = await User.findOne({ userid: event.data.object.client_reference_id });
      user.paid = 'true';
      user.tries = 750;
      // changeUserToPaid(event.data.object.client_reference_id);
      break;
    case 'customer.subscription.updated':
      console.log('-------------------------------------------new event-------------------------------------------')
      console.log(event.data);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.send();
});


app.post('/get/message',bodyParser.json(), async (req, res) => {
    let targetData = req.body;
    console.log(targetData);
    const user = await User.findOne({ userid: targetData.curUserId });
    const userStatus = checkPaidUserTriesMain(user);
    if (user.tries == 0) {
      res.json(['limit reached', userStatus ]);
    }
    else{
      user.tries = user.tries - 1;
      user.save();
      let popupFills = await emailAndMessageMain(user, targetData);
      console.log('popupFills: ' + popupFills);
      let message = popupFills[0];
      // let emailOptions = popupFills[1];
      res.json([userStatus, message]);
    }
});

app.get('/get/userstat/:id', async (req, res) => {
  const user = await User.findOne({ userid: req.params.id });
  console.log(user);
  const userStatus = checkPaidUserTriesMain(user);
  res.send(userStatus);
});

function checkPaidUserTriesMain(user){
  let ifPaid = user.paid;
  console.log('This is ifPaid value:' + ifPaid);
  let userTriesLeft = user.tries;
  let url = 'https://buy.stripe.com/test_cN2eYOcmH24DgDe6oo?client_reference_id=' + user.userid;
  if (ifPaid === 'true') {

    if (userTriesLeft > 0) {
      tl = `<p>You have ${userTriesLeft}/750 connections left to generate this month.</p>`;
      return tl;
    }else{
      tl = '<p>You have reached your generation limit for the month!</p>';
      return tl;
    }
  }
  else if (ifPaid === 'false'){
    if (userTriesLeft > 0) {
      tl = `You have ${userTriesLeft}/15 connections left to generate with the free trial.<br>
      To upgrade, <a href=${url} id="payment-link">Click here</a>`;
      return tl;
    }else{
      tl = `<p>You have 0/15 connections left to generate with the free trial.<br>
      To upgrade, <a href=${url} id="payment-link">Click here</p>`;
      return tl;
    }
  }
  else{
    return 'error';
  }
}

async function emailAndMessageMain(user, data){
  let userFirstName = user.firstname;
  let userEdu = user.edu.toLowerCase();
  let userPurp = user.purpose;
  let userGoal = user.goal;
  let targetFirstName = data.curName.split(" ")[0];
  let targetSchools = data.schools;
  let targetWork = data.workExperience;
  let targetHeadline = data.curHeadline;
  let targetAbout = data.curAbout;
  let prompt = promptCreator(targetSchools, targetHeadline, targetFirstName, userEdu, userPurp, userGoal);
  let message = await runCompletion(prompt);
  let generatedEmails = getEmails(data.curName.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '+'));
  console.log('below are the generated emails and message');
  console.log(message);
  console.log(generatedEmails);
  return [message.trim()]; 
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
  return JSON.stringify(jsonNames);
}

function promptCreator(targetSchools, targetHeadline, targetFirstName, userEdu, userPurp, userGoal){
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
    prompt = `write me a reach out message for Linkedin with a 300 character limit use the full amount. Follow this structure:

    (school slogan) (name of target)!, I'm (purpose). (goal).
    
    Here is the information for the structure:
    School: ${userEdu}
    Name of Target: ${targetFirstName}
    Information about Target: ${targetHeadline}
    
    My purpose: ${userPurp}
    My goal: ${userGoal}`;
  }
  else{
    prompt = `Write a peronalized reach out message for Linkedin to ${targetFirstName}. Please provide a response with a 300 character limit. Do not go over this limit.
    Follow this structure for the messagee:
    "Beardown Shane! I have been exploring careers for after college and I found your profile when looking for Alumni on Docusigns page. I have an interest in Sales/Soultions Consulting and I would to chat with you about your experiences. Let me know if you would be available!"
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


app.post('/create/user', bodyParser.urlencoded({ extended: true }), async (req, res) => {
    console.log(req.body);
    const userid = req.body.userId;
    console.log(userid);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const edu = req.body.school;
    const purpose = req.body.purpose;
    const occup = req.body.occupation;
    const goal = req.body.goal;

    const user = new User({
        userid: userid,
        firstname: firstName,
        lastname: lastName,
        edu: edu,
        occup: occup,
        purpose: purpose,
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

app.post('/edit/user', bodyParser.urlencoded({ extended: true }), async (req, res) => {
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

async function runCompletion(sentPrompt) {
  const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: sentPrompt,
      max_tokens: 75,
  });

  const curChoices = completion.data.choices.map((choice) => choice.text);
  const extractedSentence = curChoices[0].replace(/[\n\r]+/g, '').trim();

  console.log(extractedSentence);

  return extractedSentence;
}



async function zaza (){ 
const response = await fetch('https://www.zyxware.com/articles/4344/list-of-fortune-500-companies-and-their-websites');
const text = await response.text();

}