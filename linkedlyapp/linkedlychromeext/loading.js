

window.onload = function () {
    chrome.runtime.sendMessage({message: 'checkLogin'});

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'notLoggedIn') {
            window.location.href= "home.html";
        }else if (request.message === 'loggedIn') {
            window.location.href= "popup.html";
        }
        else if (request.message === 'newUser') {
            window.location.href= "createUser.html";
        }
    });
};