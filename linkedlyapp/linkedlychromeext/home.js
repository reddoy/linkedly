window.onload = function () {
    document.getElementById("createAcctBtn").onclick = function () {
        chrome.runtime.sendMessage({message: 'login'});
    }


    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === 'loggedIn') {
        document.getElementById('logoutButton').style.display = 'block';
    } else if (request.message === 'loggedOut') {
        document.getElementById('logoutButton').style.display = 'none';
    }
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({message: 'logout'});
    });
}