
window.onload = function(){
    personArr = []



    // popup.js

    // create a function that listens for the genScoresBtn to be clicked
    // then send a message to content.js to run the addScores function

    // create a function that listens for the genScoresBtn to be clicked then
    // send a message to content.js to run the addScores() function. I am building a chrome extension

    // create a funciton that listens for the genScoresBtn to be clicked then
    // runs the addScores() function in content.js. I am building a chrome extension. I keep getting an error
    // saying that Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
    // write code that avoids this error
    document.getElementById('genScoresBtn').addEventListener('click', function(){
        getScores();
    });

    async function getScores() {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        console.log([tab]);
        const response = await chrome.tabs.sendMessage(tab.id, {message: "addScores"});
        // do something with response here, not outside the function
        console.log(response);
    }


    
    const form = document.getElementById('personForm');

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        document.getElementById('linkUrl').value = url;
    });


    // create an event listener for the genScoresBtn to be clicked then sends a message to content.js
      

    // form.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     let curPost = [];
    //     const formData = new FormData(form);
    //     jsonObj = {
    //         linkedinURL:formData.get('linkUrl'),
    //         email: formData.get('email')
    //     }
    //     personArr.push(jsonObj);
    // });
    
    
//     const displayButton = document.getElementById('displayButton');
    
//     displayButton.addEventListener('click', function(){
//         document.getElementById('displaySect').innerText = JSON.stringify(personArr);
//     });
}
