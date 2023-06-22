


window.onload = function(){

  function getStatOnload(){
    let tl = document.getElementById('tL');
    chrome.storage.local.get('user', async function(result) {
      let userid = result.user;
      console.log(userid);
      console.log('hey')
      let stat = await fetch('http://127.0.0.1:3000/get/userstat/' + userid);
      let statTag= await stat.text();
      console.log(statTag);
      tl.innerHTML = statTag;
      let link = document.getElementById('payment-link');
      link.addEventListener('click', function() {
        console.log('clicked payment link');
        chrome.runtime.sendMessage({action: "openLink", url: this.getAttribute('href')});
      }
      );
    });
  }

  getStatOnload();
  

  document.querySelector('html').classList.add('fade-in');
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "Hello from the extension!"}, function(response) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
    } else {
        console.log(response);
    }
  });
});

document.getElementById('genConnectBtn').addEventListener('click', async function() {
  try {
    const curTab = await grabTab();
    const response = await grabUserDataFromContent(curTab);
    console.log(response);
    const connectDiv = document.getElementById('info-section');
    connectDiv.innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';

    const reachData = await getMessage(response);
    console.log(reachData);

    if (reachData[0] != 'limit reached') {
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
        <p>Copy and Paste into the Connection Note:</p>
        <textarea name="note" id="note" cols="60" rows="8"></textarea>
        <button id="regenBtn">Regenerate</button>
      </div>
    `;
    document.getElementById('linkUrl').value = curTab.url.replace(/^(https?:\/\/)?/, '');
    document.getElementById('note').value = reachData[1].replace(/\n/g, '');
    
    let link = document.getElementById('payment-link');
    link.addEventListener('click', function() {
      console.log('clicked payment link');
      chrome.runtime.sendMessage({action: "openLink", url: this.getAttribute('href')});
    });
    katiePretty([]);
    }else {
      connectDiv.innerHTML = `<div class="buttons">
      <button id="genConnectBtn">Generate new Connect</button>
      </div>`;
      const tL = document.getElementById('tL');
      tL.innerHTML = reachData[1];
      tL.classList.add('flash');
      setTimeout(() => {
        tL.classList.remove('flash');
      }, 1000);
}
  } catch (error) {
    console.error(error);
    // Handle the error here
  }
});

// async function getUserStatusLine(userStat){
//   let userMess = userStat[0];
//   let triesMess;
//   if (userMess == 'ntl'){
//     triesMess = '<p>You have reached your generation limit for the month!</p>';
//   }
//   else if (userMess == 'ntlnp'){
//     let userid = await getUserId();
//     let url = 'https://buy.stripe.com/8wMcOe3VUdIm0CsfYY?client_reference_id=' + userid;
//     triesMess = `<p>You have reached your free generation limit!<br>To upgrade <a href="${url}">click here</a></p>`;
//   }else if(userMess == 'usertl'){
//     triesMess = `<p>You have ${userStat[1]}/750 generations left!</p>`;
//   }
//   console.log(triesMess);
//   return triesMess;
// }

// async function getUserId() {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get('user', function(result) {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve(result.user.id);
//       }
//     });
//   });
// }

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
  document.getElementById('fullname').innerText = response.curName;
  return response;
}

// async function getEmailOptions(response) {
//   console.log(response);
//   const curName = response.curName.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '+');
//   const emailResponse = await fetch(`http://127.0.0.1:3000/email/${curName}`);
//   const emailOps = await emailResponse.json();
//   return emailOps;
// }

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
  const reachData = await reachResponse.json();
  return reachData;
}


let emailOpsArr = [];

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
      const addButton = document.getElementById('addToListBtn');
      const originalText = addButton.innerText;
    
      const fullname = document.getElementById('fullname').innerText;
      const linkedUrl = document.getElementById('linkUrl').value;
      let emailString = emailOpsArr.join(',');
      let note = document.getElementById('note').value;
    
      chrome.storage.local.get(["personList"], function(result) {
        console.log(result.personList);
        if (result.personList) {
          personArr = result.personList;
        } else {
          personArr = [];
        }
        personArr.push([fullname, linkedUrl, emailString, note]);
        saveListToStorage(personArr);
    
        // Change button text to "Added to List"
        addButton.innerText = "Added to List";
    
        // Reset button text after 1 second
        setTimeout(function() {
          addButton.innerText = originalText;
        }, 1000);
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
    document.getElementById('downloadListBtn').addEventListener('click', function(){
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