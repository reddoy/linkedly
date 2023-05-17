
window.onload = function(){

    // create a const port variable that connects to the port "genEmails"
    // and sends the message "popupGenEmails" and uses chrome.tabs and connects to the most recent tab
    

    // Send a message to the content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "Hello from the extension!"});
    });

  

    function insertLinkUrl(port) {
        port.query({active: true, currentWindow: true}, function(tabs) {
            console.log(port);
            console.log(port.url);
            var url = port.url;
            url = url.replace(/^https?:\/\/(www\.)?/i, ''); // Remove https:// and www.
            document.getElementById('linkUrl').value = url;
        });
    }



    // create a funciton that listens for the genScoresBtn to be clicked then
    // runs the addScores() function in content.js. I am building a chrome extension. I keep getting an error
    // saying that Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
    // write code that avoids this error


    async function genEmailsPopup() {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        console.log([tab]);
        const response = await chrome.tabs.sendMessage(tab.id, {message: "popupGenEmails"});
        // do something with response here, not outside the function
        console.log(response);
    }

    const allEmailFormats = [
        'first',
        'flast',
        'firstl',
        'firstlast',
        'first.last',
        'first.l',
        'flast',
        'firstl',
        'first.m.last'
    ];

    function emailFormatter(curName, domain){
        splitName = curName.split(" ");
        if (splitName.length == 2){
            first = splitName[0];
            last = splitName[1];
            firstLast = first + last;
            firstDotLast = first + '.' + last;
            firstDotL = first + '.l';
            fLast = first[0] + last;
            firstL = first + last[0];
            firstMLast = first + '.' + last[0] + last;
            return [first, last, firstLast, firstDotLast, firstDotL, fLast, firstL, firstMLast];
        }
    }

    let inputBox = document.querySelector('.emailInput');
    let upArrow = inputBox.querySelector('.up-arrow');
    let downArrow = inputBox.querySelector('.down-arrow');
    let optionsInput = inputBox.querySelector('#email');
  
    upArrow.addEventListener('click', () => {
        let currentValue = optionsInput.value;
        let options = ['Option 1', 'Option 2', 'Option 3'];
        let currentIndex = options.indexOf(currentValue);
        if (currentIndex < options.length - 1) {
        optionsInput.value = options[currentIndex + 1];
        }
    });
    
    downArrow.addEventListener('click', () => {
        let currentValue = optionsInput.value;
        let options = ['Option 1', 'Option 2', 'Option 3'];
        let currentIndex = options.indexOf(currentValue);
        if (currentIndex > 0) {
        optionsInput.value = options[currentIndex - 1];
        }
    });

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


}