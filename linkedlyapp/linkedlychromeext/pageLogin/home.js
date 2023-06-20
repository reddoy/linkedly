chrome.runtime.sendMessage({message: 'checkLogin'});
window.onload = function () {



    document.getElementById("createAcctBtn").onclick = function () {
        chrome.runtime.sendMessage({message: 'login'});
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "Hello from the extension!"});

        if (!tabs[0].url.includes("linkedin.com/in/")) {
            document.getElementById('main-content').innerHTML = '<p id="notProfError">Please go to a LinkedIn profile page to use this extension.</p>';
        }
    });


    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'loggedIn') {
            window.location.href= "popup.html";
        } else if (request.message === 'loggedOut') {
            document.getElementById('logoutButton').style.display = 'none';
        } else if(request.message === 'alreadyLoggedIn') {
            window.location.href= "popup.html";
        }
        else if (request.message === 'newUser') {
            window.location.href= "createUser.html";
        }
    });


    document.getElementById('logoutButton').addEventListener('click', function() {
        console.log('logout button clicked');
    chrome.runtime.sendMessage({message: 'logout'});
    });


}