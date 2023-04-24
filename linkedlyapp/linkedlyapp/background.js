/*This function will look get the current url of the webpage the user is currently on.
Then it will set the linkUrl input value to what the link is. I am building a chrome extension*/
function getCurrentUrl(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        let currentUrl = tabs[0].url;
        document.getElementById('linkUrl').value = currentUrl;
    });
}