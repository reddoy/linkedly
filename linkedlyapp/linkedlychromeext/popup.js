window.onload = function(){

    // create a funciton that listens for the genScoresBtn to be clicked then
    // runs the addScores() function in content.js. I am building a chrome extension. I keep getting an error
    // saying that Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
    // write code that avoids this error

    function saveListToStorage(list) {
        chrome.storage.local.set({ "personList": list }, function() {
            console.log("Value stored");
            document.getElementById('email').value = '';
            document.getElementById('note').value = '';
            let addListBtn = document.getElementById('subbutton');
            addListBtn.value = "Added!";
            setTimeout(function(){
                addListBtn.value = "Add to List";
            }, 1000);
          });
      }

    allEmailFormats = [
        'first',
        'flast',
        'firstl',
        'firstlast',
        'first.last',
        'first.l',
        'flast',
        'firstl',
        'first.m.last',
        
    ];
    async function genEmailsPopup() {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        console.log([tab]);
        const response = await chrome.tabs.sendMessage(tab.id, {message: "popupGenEmails"});
        // do something with response here, not outside the function
        console.log(response);
    }
    genEmailsPopup();

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        url = url.replace(/^https?:\/\/(www\.)?/i, ''); // Remove https:// and www.
        document.getElementById('linkUrl').value = url;
    });
    

    // create code that listens for the message from content.js 
    // that contains the message genEmails
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(request.message);
        if (request.message == "genEmails") {
            console.log("message recieved: " + request.curName);
            getDomainName(request.curCompany).then(domain => {
                console.log(domain);
                let email = request.curName.split(" ")[0] + "@" + domain;
                document.getElementById('email').value = email;
            });
        }
    });

    async function getDomainName(companyName) {
        console.log(companyName);
        const apiKey = ''; // replace with your Hunter API key
        const url = `https://api.hunter.io/v2/domain-search?company=${encodeURIComponent(companyName)}&api_key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data.domain;
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

    // create a function that listens for when the clearListBtn button is clicked
    // then clears the personList from chrome storage
    document.getElementById('clearListBtn').addEventListener('click', function(){
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
}

window.onload = function(){
    const inputBox = document.querySelector('.emailInput');
    const upArrow = inputBox.querySelector('.up-arrow');
    const downArrow = inputBox.querySelector('.down-arrow');
    const optionsInput = inputBox.querySelector('#email');
  
  upArrow.addEventListener('click', () => {
    const currentValue = optionsInput.value;
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const currentIndex = options.indexOf(currentValue);
    if (currentIndex < options.length - 1) {
      optionsInput.value = options[currentIndex + 1];
    }
  });
  
  downArrow.addEventListener('click', () => {
    const currentValue = optionsInput.value;
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const currentIndex = options.indexOf(currentValue);
    if (currentIndex > 0) {
      optionsInput.value = options[currentIndex - 1];
    }
  });
  }