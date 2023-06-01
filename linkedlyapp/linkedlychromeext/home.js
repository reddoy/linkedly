window.onload = function () {
    document.getElementById("createAcctBtn").onclick = function () {
        chrome.runtime.sendMessage({message: 'login'});
    }


    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === 'loggedIn') {
        window.location.href= "popup.html";
    } else if (request.message === 'loggedOut') {
        document.getElementById('logoutButton').style.display = 'none';
    } else if(request.message === 'alreadyLoggedIn') {
        window.location.href= "popup.html";
    }
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({message: 'logout'});
    });
}