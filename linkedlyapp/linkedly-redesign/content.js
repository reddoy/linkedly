let linkedlyDiv;
let numberCalled = 0;
let portToBackgroundScript = chrome.runtime.connect({name: 'contentScriptToBackgroundScript'});
let hasLinkedlyLoaded= false;
let chainlogoNoBG = chrome.runtime.getURL('images/chain-link-noBG.svg');
let chainlogoMain = chrome.runtime.getURL('images/chain-logo-small-svg.svg')
let popupMain;


async function loadHtml() {
  try {
      let response = await fetch(chrome.runtime.getURL('pageMainPopup/popup.html'));
      let data = await response.text();
      
      const parser = new DOMParser();
      const htmlDocument = parser.parseFromString(data, 'text/html');
      popupMain = htmlDocument.querySelector('#body');

      // Do something with myElement
  } catch (err) {
      console.warn('Error occurred', err);
  }
}

loadHtml();



async function checkLogin(){
  await elementsStable();
  if(!doesLinkedlyDivExist()){
    createLinkedlyDiv();
    insertLinkedlyDiv();
    portToBackgroundScript.postMessage({message: 'checkLogin'});
  }
}

checkLogin();


portToBackgroundScript.onMessage.addListener(function(request) {
  console.log('Message received: ', request);
    if (request.message === 'notLoggedIn') {
      linkedlyDiv.innerHTML = 'user not logged in';
      console.log(document.getElementById('linkedly-div'));
  } else if (request.message === 'loggedIn') {
      linkedlyDiv.innerHTML = popupMain.innerHTML;
      document.getElementById('linkedlylogo').src = chainlogoMain;
      document.getElementById('genBtnImg').src = chainlogoNoBG;
      document.getElementById('linkedly-header').classList.add('text-heading-xlarge', 'inline', 't-24', 'v-align-middle', 'break-words');
  } else if (request.message === 'newUser') {
      linkedlyDiv.innerHTML = 'new user';
  }else if(request.message = 'tabChanged'){
    console.log(document.querySelector('div.ph5 > div.mt2.relative > div:nth-child(1) > div:nth-child(1) > h1'));
    if(doesLinkedlyDivExist()){
      console.log('linkedly div does not exist')
      
    }else{
      console.log('linkedly div does Exist');
      checkLogin();
    }
  }
});



function createLinkedlyDiv() {
  console.log('Creating Linkedly div...');
  linkedlyDiv = document.createElement('div');
  linkedlyDiv.id = 'linkedly-div';
  linkedlyDiv.classList.add('artdeco-card', 'ember-view', 'relative', 'break-words', 'pb3', 'mt2');
  console.log('Linkedly div created.');
  return linkedlyDiv;
}

function insertLinkedlyDiv() {
  console.log('Inserting Linkedly div into webpage...');
  const mainSections = document.querySelector('div > div.scaffold-layout.scaffold-layout--breakpoint-xl.scaffold-layout--main-aside.scaffold-layout--reflow.pv-profile > div > div > main');
  const secondChild = mainSections.children[1];
  mainSections.insertBefore(linkedlyDiv, secondChild);
  console.log('Linkedly div inserted into webpage.');
}


function doesLinkedlyDivExist(){
  console.log(document.getElementById('linkedly-div'));
  if (document.getElementById('linkedly-div')){
    console.log('returned true');
    return true;
  }else{
    console.log('returned false');
    return false;
  }
}


function addLoginButton() {
  console.log('Adding login button to Linkedly div...');
  const button = document.createElement('button');
  button.innerHTML = 'Login';
  button.id = 'linkedly-login-button';

  // add the classes to the button
  button.classList.add('artdeco-dropdown__trigger', 'artdeco-dropdown__trigger--placement-bottom', 'ember-view', 
  'pvs-profile-actions__action', 'artdeco-button', 'artdeco-button--secondary', 'artdeco-button--muted', 'artdeco-button--2');

  button.setAttribute('type', 'button');

  // attach event listener to button
  button.addEventListener('click', function() {
    chrome.runtime.sendMessage({message: 'login'});
  });

  linkedlyDiv.appendChild(button);
  console.log('Login button added to Linkedly div.');
}


function elementsStable() {
  return new Promise((resolve) => {
    let lastCount = 0;
    let repeatCount = 0;

    const observer = new MutationObserver(() => {
      const count = document.querySelectorAll('*').length;
      if (count === lastCount) {
        repeatCount += 1;
        if (repeatCount === 4) {
          observer.disconnect();
          console.log('The number of elements on the page has stabilized at: ' + count);
          resolve();
        }
      } else {
        repeatCount = 0;
      }
      lastCount = count;
    });

    observer.observe(document.body, {childList: true, subtree: true});

    // Check every 10 milliseconds
    let intervalId = setInterval(() => {
      const count = document.querySelectorAll('*').length;
      console.log('There are currently ' + count + ' elements on the page.');
      if (count === lastCount) {
        repeatCount += 1;
        if (repeatCount === 100 && count > 1000) {
          console.log(repeatCount);
          clearInterval(intervalId);
          observer.disconnect();
          console.log('The number of elements on the page has stabilized at: ' + count);
          resolve();
        }
      } else {
        repeatCount = 0;
      }
      lastCount = count;
    }, 10);
  });
}



