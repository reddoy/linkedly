
window.onload = function(){
    personArr = []

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

    // create a funciton that listens for when the personForm is submitted
    // then runs the addPerson(linkedUrl, Name) function and passes in the values
    // from the form
    form.addEventListener('submit', function(e){
        e.preventDefault();
        const linkedUrl = document.getElementById('linkUrl').value;
        const name = document.getElementById('name').value;
        addPerson(linkedUrl, name);
    });

    // create a function that listens for when the downloadPpl button is clicked
    // then conversts each array in the personArr to a csv file and downloads it
    // to the users computer
    document.getElementById('downloadPpl').addEventListener('click', function(){
        downloadCSV(personArr);
    });

    //this function takes in a array filled with arrays of people objects 


}
