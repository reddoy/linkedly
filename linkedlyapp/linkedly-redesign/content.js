// let linkedlyDiv;
// let numberCalled = 0;
// let portToBackgroundScript = chrome.runtime.connect({name: 'contentScriptToBackgroundScript'});
// let hasLinkedlyLoaded= false;


// function checkLogin(){
//   addLinkedlyDivWhenInterestsLoaded();
//   portToBackgroundScript.postMessage({message: 'checkLogin'});
// }

// addLinkedlyDivWhenInterestsLoaded();
// portToBackgroundScript.postMessage({message: 'checkLogin'});

// window.onpopstate = function(event) {
//   checkLogin(); 
// };

// portToBackgroundScript.onMessage.addListener(function(request) {
//   console.log('Message received: ', request);
//     if (request.message === 'notLoggedIn') {
//       linkedlyDiv.innerHTML = 'user not logged in';
//   } else if (request.message === 'loggedIn') {
//       linkedlyDiv.innerHTML = 'user logged in';
//   } else if (request.message === 'newUser') {
//       linkedlyDiv.innerHTML = 'new user';
//   }
// });



// function createLinkedlyDiv() {
//   console.log('Creating Linkedly div...');
//   linkedlyDiv = document.createElement('div');
//   linkedlyDiv.innerHTML = `<div id="linkedly-div"></div>`;
//   linkedlyDiv.classList.add('artdeco-card', 'ember-view', 'relative', 'break-words', 'pb3', 'mt2');
//   console.log('Linkedly div created.');
//   return linkedlyDiv;
// }

// function insertLinkedlyDiv() {
//   console.log('Inserting Linkedly div into webpage...');
//   const mainSections = document.querySelector('div > div.scaffold-layout.scaffold-layout--breakpoint-xl.scaffold-layout--main-aside.scaffold-layout--reflow.pv-profile > div > div > main');
//   const secondChild = mainSections.children[1];
//   mainSections.insertBefore(linkedlyDiv, secondChild);
//   console.log('Linkedly div inserted into webpage.');
// }

// function addLinkedlyDivWhenInterestsLoaded() {
//   console.log('Starting to observe for #interests element...');
//   const observer = new MutationObserver((mutationsList, observer) => {
//     for(let mutation of mutationsList) {
//       if (mutation.type === 'childList') {
//         const interests = document.querySelector('#interests');
//         if (interests) {
//           console.log('#interests element found.');
//           if (!document.querySelector('#linkedly-div')) {  // check the id of the div you insert
//             if (!linkedlyDiv) {
//               createLinkedlyDiv();
//             }
//             insertLinkedlyDiv();
//             hasLinkedlyLoaded = true;
//             numberCalled += 1;
//             console.log(numberCalled);
//             observer.disconnect();  // stop observing once #linkedly-div has been inserted
//             console.log('Observer disconnected.');  // log when the observer is done
//           }
//         }
//       }
//     }
//   });

//   // Start observing the document with the configured parameters
//   observer.observe(document.body, { childList: true, subtree: true });
// }




// function addLoginButton() {
//   console.log('Adding login button to Linkedly div...');
//   const button = document.createElement('button');
//   button.innerHTML = 'Login';
//   button.id = 'linkedly-login-button';

//   // add the classes to the button
//   button.classList.add('artdeco-dropdown__trigger', 'artdeco-dropdown__trigger--placement-bottom', 'ember-view', 
//   'pvs-profile-actions__action', 'artdeco-button', 'artdeco-button--secondary', 'artdeco-button--muted', 'artdeco-button--2');

//   button.setAttribute('type', 'button');

//   // attach event listener to button
//   button.addEventListener('click', function() {
//     chrome.runtime.sendMessage({message: 'login'});
//   });

//   linkedlyDiv.appendChild(button);
//   console.log('Login button added to Linkedly div.');
// }


let lastCount = 0;
let repeatCount = 0;
const observer = new MutationObserver(() => {
  const count = document.querySelectorAll('*').length;
  if (count === lastCount) {
    repeatCount += 1;
    if (repeatCount === 4) {
      observer.disconnect();
      console.log('The number of elements on the page has stabilized at: ' + count);
    }
  } else {
    repeatCount = 0;
  }
  lastCount = count;
});

observer.observe(document.body, {childList: true, subtree: true});

// Check every 10 milliseconds
setInterval(() => {
  const count = document.querySelectorAll('*').length;
  console.log('There are currently ' + count + ' elements on the page.');
  if (count === lastCount) {
    repeatCount += 1;
    if (repeatCount === 4) {
      clearInterval(this);
      observer.disconnect();
      console.log('The number of elements on the page has stabilized at: ' + count);
    }
  } else {
    repeatCount = 0;
  }
  lastCount = count;
}, 10);
