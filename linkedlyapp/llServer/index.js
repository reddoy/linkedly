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
mongoose.connect(process.env.MONG, {
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
  subid: String,
  cusId: String,
  status: String,
});

const emailDomainSchema = new mongoose.Schema({
  company_name: String,
  domain: String,
});

const User = mongoose.model('User', userSchema);
const EmailDomain = mongoose.model('EmailDomain', emailDomainSchema);

app.use(express.static(__dirname+'/public_html'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const stripe = new Stripe('whsec_d3c04e45fffbed0756cf7e39807adba9ede94b7f34f17889d0ac1ac67f0942a5');
const endpointSecret = 'whsec_d3c04e45fffbed0756cf7e39807adba9ede94b7f34f17889d0ac1ac67f0942a5';

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
  let user;
  switch (event.type) {
    case 'checkout.session.completed':
      console.log(event.data.object.client_reference_id + '-----------------------');
      console.log(event.data.object.subscription+ '-----------sub num here');
      user = await User.findOne({ userid: event.data.object.client_reference_id });
      user.subid = event.data.object.subscription;
      user.save();
      break;
    case 'invoice.payment_succeeded':
      console.log('invoice.payment_succeded: --------------------------')
      console.log(event.data.object)
      user = await User.findOne({ subid: event.data.object.subscription });
      user.paid = 'true';
      user.tries = 750;
      user.save();
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
    if(!user){
      console.log('error');
      res.send('error');
    }else{
      const userStatus = checkPaidUserTriesMain(user);
      if (user.tries == 0) {
        res.json(['limit reached', userStatus ]);
      }
      else if(user.tries > 0){
        user.tries = user.tries - 1;
        user.save();
        let popupFills = await emailAndMessageMain(user, targetData);
        let message = popupFills[0];
        res.json([userStatus, message, popupFills[1]]);
      }
      else{
        res.send('error');
      }
    }

});

app.post('/regen/message/', bodyParser.json(), async (req, res) => {
  let targetData = req.body;
  console.log(targetData);
  const user = await User.findOne({ userid: targetData.curUserId });
  if(!user){
    res.send('error');
  }else{
    let userStatus = checkPaidUserTriesMain(user);
    if (user.tries == 0) {
      res.json(['limit reached', userStatus ]);
    }
    else if(user.tries > 0){
      user.tries = user.tries - 1;
      user.save();
      userStatus = checkPaidUserTriesMain(user);
      let popupFills = await emailAndMessageMain(user, targetData);
      let message = popupFills[0];
      res.json([userStatus, message]);
    }
    else{
      res.send('error');
    }
  }


});

app.get('/get/userstat/:id', async (req, res) => {
  console.log('this is the id passed in from getuserstat: ' + req.params.id);
  if(req.params.id == 'undefined'){
    res.send('error');
  }else{
    const user = await User.findOne({ userid: req.params.id });
    console.log(user);
    const userStatus = checkPaidUserTriesMain(user);
    res.send(userStatus);
  }
});

app.get('/get/userinfo/:id', async (req, res) => {
  let userid = req.params.id;
  const user = await User.findOne({ userid: userid });
  let userObj = {
    firstname: user.firstname,
    lastname: user.lastname,
    edu: user.edu,
    occup: user.occup,
    purpose: user.purpose,
    goal: user.goal,
  }
  res.send(userObj);
});

function checkPaidUserTriesMain(user){
  let ifPaid = user.paid;
  console.log('This is ifPaid value:' + ifPaid);
  let userTriesLeft = user.tries;
  let url = 'https://buy.stripe.com/test_cN2eYOcmH24DgDe6oo?client_reference_id=' + user.userid;
  if (ifPaid === 'true') {

    if (userTriesLeft > 0) {
      tl = `You have ${userTriesLeft}/750 connections left to generate this month.`;
      return tl;
    }else{
      tl = 'You have reached your generation limit for the month!';
      return tl;
    }
  }
  else if (ifPaid === 'false'){
    if (userTriesLeft > 0) {
      tl = `You have ${userTriesLeft}/15 connections left to generate with the free trial.<br>
      To upgrade, <a href=${url} id="payment-link">Click here</a>`;
      return tl;
    }else{
      tl = `You have 0/15 connections left to generate with the free trial.<br>
      To upgrade, <a href=${url} id="payment-link">Click here</a>`;
      return tl;
    }
  }
  else{
    return 'error';
  }
}

async function emailAndMessageMain(user, data){
  let userEdu = user.edu.toLowerCase();
  let userPurp = user.purpose;
  let userGoal = user.goal;
  let targetFirstName = data.curName.split(" ")[0];
  let targetSchools = data.schools;
  let targetWork = data.workExperience;
  let curCompany = targetWork[0];
  let targetHeadline = data.curHeadline;
  let prompt = promptCreator(targetSchools, targetHeadline, targetFirstName, userEdu, userPurp, userGoal);
  let message = await runCompletion(prompt);
  let targetName = data.curName.replace(/['.]/g, "");
  let generatedEmails = await getEmails(targetName.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, '+'), curCompany);
  console.log(generatedEmails[0]);
  console.log('these are generated emails: ' + generatedEmails);
  return [message.trim(), generatedEmails]; 
}

async function regenMessage(user, data){
  let userEdu = user.edu.toLowerCase();
  let userPurp = user.purpose;
  let userGoal = user.goal;
  let targetFirstName = data.curName.split(" ")[0];
  let targetSchools = data.schools;
  let targetHeadline = data.curHeadline;
  let prompt = promptCreator(targetSchools, targetHeadline, targetFirstName, userEdu, userPurp, userGoal);
  let message = await runCompletion(prompt);
  return [message.trim()]; 
}

async function getEmails(name,companyName){
  console.log(`Hello ${name}!`);
  console.log(`Hello ${companyName}!`)
  let splitName = name.split("+");
  let first = splitName[0];
  let last = splitName[1];
  let firstLetter = first[0];

  let doesDomainExist = await EmailDomain.findOne({ company_name: companyName });
  let domain;
  if (doesDomainExist) {
    domain = doesDomainExist.domain;
    console.log('domain exists in MongoDB: '+ domain);
  }else{
    const apiKey = process.env.HUNTERIO_API_KEY; // replace with your Hunter API key
    const url = `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(companyName)}&api_key=${apiKey}`;
    const response = await fetch(url);
    let hunterRes = await response.json();
    domain = hunterRes.data.domain;
    console.log('domain does not exist in MongoDB: '+ domain);
    if(!domain){
      domain = ['Could not find domain for this company.']
      return domain;
    }else{
      const newDomain = new EmailDomain({
        company_name: companyName.toLowerCase(),
        domain: domain
      });
      newDomain.save();
    }
  }

  let jsonNames = [
    `${splitName[0]}@${domain}`,
    `${first}${last}@${domain}`,
    `${firstLetter}${last}@${domain}`,
    `${first}.${last}@${domain}`,
    `${firstLetter}.${last}@${domain}`,
    `${firstLetter}_${last}@${domain}`
    ];
  console.log(jsonNames);
  return jsonNames;
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
    My goal: ${userGoal}
    Do not use any commas.`;
  }
  else{
    prompt = `write me a reach out message for Linkedin with a 300 character limit use the full amount. Follow this structure:

    "Hi (name of target)!, I'm (purpose). (goal)."
    
    Here is the information for the structure:
    Name of Target: ${targetFirstName}
    Information about Target: ${targetHeadline}
    
    My purpose: ${userPurp}
    My goal: ${userGoal}
    Do not use any commas.`;
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
      max_tokens: 100,
  });

  const curChoices = completion.data.choices;
  const textChoices = [];
  for (let i = 0; i < curChoices.length; i++) {
    const choice = curChoices[i];
    textChoices.push(choice.text);
  }

  const mess = textChoices[0].trim();
  console.log('before newline removal: '+ mess);
  console.log('---------------++');
  const index = mess.indexOf('\n');
  const extractedString = index !== -1 ? mess.substring(index + 1) : mess;

  console.log(extractedString);
  console.log('---------------++');
  return extractedString;
}
