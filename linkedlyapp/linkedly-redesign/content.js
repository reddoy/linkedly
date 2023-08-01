let linkedlyDiv;
let numberCalled = 0;

function checkLogin(){
  addLinkedlyDivWhenInterestsLoaded()
  chrome.runtime.sendMessage({message:'checkLogin'});
}

checkLogin();

window.onpopstate = function(event) {
  checkLogin(); // Or directly call addLinkedlyDivWhenInterestsLoaded()
};


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'notLoggedIn') {
    linkedlyDiv.innerHTML = 'user not logged in';
  } else if (request.message === 'loggedIn') {
    linkedlyDiv.innerHTML = 'user logged in';

  } else if (request.message === 'newUser') {

  }
});


function createLinkedlyDiv() {
  console.log('Creating Linkedly div...');
  linkedlyDiv = document.createElement('div');
  linkedlyDiv.innerHTML = `<div id="linkedly-div"></div>`;
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

function addLinkedlyDivWhenInterestsLoaded() {
  console.log('Starting to observe for #interests element...');
  const observer = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const interests = document.querySelector('#interests');
        if (interests) {
          console.log('#interests element found.');
          if (!document.querySelector('#linkedly-div')) {  // check the id of the div you insert
            if (!linkedlyDiv) {
              createLinkedlyDiv();
            }
            insertLinkedlyDiv();
            numberCalled += 1;
            console.log(numberCalled);
          }
        }
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
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


