// Create a new observer instance
var observer = new MutationObserver(function(mutations) {
  // For each mutation
  mutations.forEach(function(mutation) {
    // If the addedNodes property has one or more nodes
    if (mutation.addedNodes.length) {
      const buttonsList = document.querySelector('div.ph5.pb5 > div.pv-top-card-v2-ctas > div');      
      if (buttonsList) {
        console.log('Element loaded:', buttonsList);
        // Do something with mainSections here
        // ...

        // Once we have found the element, we don't need the observer anymore
        observer.disconnect();
        isObserving = false;
      }
    }
  });
});

// Start observing the document with the configured parameters
// var isObserving = true; // Set initial state
observer.observe(document.body, { childList: true, subtree: true });

// Set an interval to check the isObserving variable every second
var observerPromise = new Promise(function(resolve) {
  var checkInterval = setInterval(function() {
    if (!isObserving) {
      console.log('Observer has stopped');
      clearInterval(checkInterval); // Stop the interval when the observer is no longer active
      resolve(); // Resolve the promise
    }
  }, 1000);
});


async function pageLoaded(){
  await observerPromise;
  addLoginButton();
}

pageLoaded();

function addLoginButton() {
  const buttonsList = document.querySelector('div.ph5.pb5 > div.pv-top-card-v2-ctas > div');
  console.log(buttonsList);
  const loginButton = document.createElement("button");
  const imageURL = chrome.runtime.getURL('images/chainlogonobg.png');
  
  loginButton.innerHTML = `Login to Linkedly <img src="${imageURL}">`;
  
  loginButton.classList.add("artdeco-button", "artdeco-button--2", "artdeco-button--secondary", "ember-view");
  buttonsList.appendChild(loginButton);
}






  // const generateButton = document.createElement("button");
  // generateButton.textContent = "Generate";

  // // Apply the styles to the generateButton by adding multiple classes
  // generateButton.classList.add("artdeco-button", "artdeco-button--2", "artdeco-button--secondary", "ember-view");

  // buttonsList.appendChild(generateButton);

  // const mainSections = document.querySelector('div > div.scaffold-layout.scaffold-layout--breakpoint-xl.scaffold-layout--main-aside.scaffold-layout--reflow.pv-profile > div > div > main');

  // const headerSection = mainSections.querySelector(":first-child");

  // const divTest = document.createElement("div");
  // divTest.innerHTML = `
  //   <h1>Hello from Chrome Extension!</h1>
  //   <p>This is injected HTML.</p>
  //   <button id="clickMeButton">Click me!</button>
  // `;

  // // Event listener for generateButton click
  // generateButton.addEventListener("click", () => {
  //   // Replace headerSection with divTest
  //   mainSections.replaceChild(divTest, headerSection);
  // });

  // // Event listener for Click me! button click inside divTest
  // divTest.addEventListener("click", (event) => {
  //   // Check if the clicked element is the "Click me!" button
  //   if (event.target.id === "clickMeButton") {
  //     // Put the headerSection back in place (before divTest)
  //     mainSections.insertBefore(headerSection, divTest);
  //   }
  // });

