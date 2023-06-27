
window.onload = function () {



    document.getElementById("createAcctBtn").onclick = function () {
        document.getElementById('main-content').innerHTML = '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
        chrome.runtime.sendMessage({message: 'login'});
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "Hello from the extension!"});
    });


    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'loggedIn') {
            window.location.href= "../pageMainPopup/popup.html";
        } else if (request.message === 'loggedOut') {
            document.getElementById('logoutButton').style.display = 'none';
        } else if(request.message === 'alreadyLoggedIn') {
            window.location.href= "../pageMainPopup/popup.html";
        }
        else if (request.message === 'newUser') {
            window.location.href= "../pageCreateUser/createUser.html";
        }
    });
}