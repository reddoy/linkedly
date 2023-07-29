let linkedlyDiv;

function createLinkedlyDiv() {
  console.log('Creating Linkedly div...');
  linkedlyDiv = document.createElement('div');
  linkedlyDiv.id = 'linkedly-div-container';
  linkedlyDiv.innerHTML = '<div id="linkedly-div">Linkedly</div>';
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
          if (!document.querySelector('#linkedly-div-container')) {
            if (!linkedlyDiv) {
              createLinkedlyDiv();
            }
            insertLinkedlyDiv();
          }
        }
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
}


addLinkedlyDivWhenInterestsLoaded();
