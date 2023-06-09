


window.onload = function(){
  document.querySelector('html').classList.add('fade-in');
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "Hello from the extension!"}, function(response) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
    } else {
        console.log(response);
    }
});

    if (!tabs[0].url.includes("linkedin.com/in/")) {
        document.getElementById('main-content').innerHTML = '<p id="notProfError">Please go to a LinkedIn profile page to use this extension.</p>';
    }
});

document.getElementById('genConnectBtn').addEventListener('click', async function() {
  try {
    const curTab = await grabTab();
    const response = await grabUserDataFromContent(curTab);
    console.log(response);
    const emailOps = await getEmailOptions(response);
    const connectDiv = document.getElementById('connect-section');
    connectDiv.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';

    const reachData = await getMessage(response);
    
    connectDiv.innerHTML = `
      <div class="question">
        <label for="linkUrl">Linkedin URL</label>
        <input type="text" name="linkUrl" id="linkUrl">
      </div>
      <div class="question">
        <label for="email">Email</label>
        <div class="emailInput">
          <input type="text" id="email" name="email" value="Use Arrows to look at Emails" disabled>
          <div class="arrows">
            <button class="up-arrow">&#9650;</button>
            <button class="down-arrow">&#9660;</button>
          </div>
        </div>
      </div>
      <div class="question">
        <label for="note">Note</label>
        <textarea name="note" id="note" cols="15" rows="5"></textarea>
      </div>
    `;
    document.getElementById('linkUrl').value = curTab.url;
    console.log(reachData);
    katiePretty(emailOps);
  } catch (error) {
    console.error(error);
    // Handle the error here
  }
});

async function grabTab() {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  const curTab = tabs[0];
  return curTab;
}

async function grabUserDataFromContent(curTab){
  const response = await new Promise(resolve => {
    chrome.tabs.sendMessage(curTab.id, {message: "genConnect"}, resolve);
  });
  console.log(response);
  return response;
}

async function getEmailOptions(response) {
  console.log(response);
  const curName = response.curName.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '+');
  const emailResponse = await fetch(`http://127.0.0.1:3000/email/${curName}`);
  const emailOps = await emailResponse.json();
  return emailOps;
}

async function getMessage(response) {
  const userid = await isUserLoggedIn();
  console.log(userid);
  const reachJson = {
    curUserId: userid,
    curName: response.curName,
    workExperience: response.workExperience,
    schools: response.schools,
    curHeadline: response.curHeadline,
    curAbout: response.curAbout,
  };
  const reachResponse = await fetch('http://127.0.0.1:3000/get/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reachJson)
  });
  const reachData = await reachResponse.text();
  return reachData;
}




  // create a funciton that listens for the genScoresBtn to be clicked then
  // runs the addScores() function in content.js. I am building a chrome extension. I keep getting an error
  // saying that Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
  // write code that avoids this error
function katiePretty(emailOptions) {
    let inputBox = document.querySelector('.emailInput');
    let upArrow = inputBox.querySelector('.up-arrow');
    let downArrow = inputBox.querySelector('.down-arrow');
    let optionsInput = inputBox.querySelector('#email');

    upArrow.addEventListener('click', () => {
        let currentValue = optionsInput.value;
        let options = emailOptions;
        let currentIndex = options.indexOf(currentValue);
        if (currentIndex < options.length - 1) {
        optionsInput.value = options[currentIndex + 1];
        }
    });
    
    downArrow.addEventListener('click', () => {
        let currentValue = optionsInput.value;
        let options = emailOptions;
        let currentIndex = options.indexOf(currentValue);
        if (currentIndex > 0) {
        optionsInput.value = options[currentIndex - 1];
        }
    });
}


    // create a funciton that listens for when the personForm is submitted
    // then runs the addPerson(linkedUrl, Name) function and passes in the values
    // from the form
    
    document.getElementById('addToListBtn').addEventListener('click', function(){
        const linkedUrl = document.getElementById('linkUrl').value;
        let email = document.getElementById('email').value;
        let note = document.getElementById('note').value;
        chrome.storage.local.get(["personList"], function(result) {
            console.log(result.personList);
            if (result.personList) {
                personArr = result.personList;
            } else {
                personArr = [];
            }
            personArr.push([email, linkedUrl, note]);
            saveListToStorage(personArr);
            linkedUrl.value = '';
            email.value = '';
            note.value = '';
          });
    });

    function saveListToStorage(list) {
        chrome.storage.local.set({ "personList": list }, function() {
            console.log("Value stored");
            let addListBtn = document.getElementById('addToListBtn');
            addListBtn.value = "Added!";
            setTimeout(function(){
                addListBtn.value = "Add to List";
            }, 1000);
          });
      }

    // create a function that listens for when the clearListBtn button is clicked
    // then clears the personList from chrome storage
    document.getElementById('clearListBtn').addEventListener('click', function(){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "Hi this is a message from Google! We scraped 40 million sites and found Katie Drake is the most beautiful girl in the world!"});
            console.log('sent message');
          });
        chrome.storage.local.clear(function() {
            console.log("personList cleared");
            // write code that changes the text of clearListBtn to say "List Cleared"
            // for 1 second then changes back to "Clear List"
            let clearListBtn = document.getElementById('clearListBtn');
            clearListBtn.innerHTML = "List Cleared";
            setTimeout(function(){
                clearListBtn.innerHTML = "Clear List";
            }, 1000);
        });
    });
        
    // create a function that listens for when the downloadPpl button is clicked
    // then conversts each array in the personArr to a csv file and downloads it
    // to the users computer
    document.getElementById('downloadPpl').addEventListener('click', function(){
        chrome.storage.local.get(["personList"], function(result) {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Email,LinkedIn URL,Note\r\n";
            console.log(result.personList);
            result.personList.forEach(function(rowArray){
                let row = rowArray.join(",");
                csvContent += row + "\r\n";
            });
            var encodedUri = encodeURI(csvContent);
            window.open(encodedUri);
          });
    });

async function isUserLoggedIn() {
  try {
    const token = await chrome.identity.getAuthToken({ 'interactive': false });
    if (!token) {
      // User is not signed in.
      console.log("User is not signed in");
      window.location.href = "home.html";
      return null;
    }

    // User is signed in.
    console.log("User is signed in");
    console.log(token);
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token.token);
    const data = await response.json();
    console.log(data);
    const userId = data.id;
    console.log(userId);
    return userId;
  } catch (error) {
    console.log(error);
    return null;
  }
}

}