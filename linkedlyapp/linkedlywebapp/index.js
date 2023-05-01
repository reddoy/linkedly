const axios = require('axios');

const prompt = "Once upon a time";

const openaiApiKey = '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';

const params = {
  "model": "text-davinci-002",
  "temperature": 0.7,
  "max_tokens": 60,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
};

axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
  prompt,
  ...params,
}, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `${openaiApiKey}`,
  },
})
.then(response => {
  console.log(response.data.choices[0].text);
})
.catch(error => {
  console.error(error);
});