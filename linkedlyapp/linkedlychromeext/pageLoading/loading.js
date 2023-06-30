window.onload = function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs[0].url.includes("linkedin.com/in/")) {
            document.getElementById('main-content').innerHTML = '<p id="notProfError">Please go to a LinkedIn profile page to use this extension.</p>';
        }
        else{
            chrome.runtime.sendMessage({message: 'checkLogin'});
        }
    });
    

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'notLoggedIn') {
            setTimeout(function() {
                window.location.href= "../pageLogin/home.html";
            }, 1000);
        } else if (request.message === 'loggedIn') {
            console.log('redirecting to main popup');
            setTimeout(function() {
                window.location.href= "../pageMainPopup/popup.html";
            }, 1000);
        } else if (request.message === 'newUser') {
            console.log('redirecting to create user page');
            setTimeout(function() {
                window.location.href= "../pageCreateUser/createUser.html";
            }, 1000);
        }
    });
};