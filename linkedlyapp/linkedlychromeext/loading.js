window.onload = function () {
    chrome.runtime.sendMessage({message: 'checkLogin'});

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.message === 'notLoggedIn') {
            document.body.classList.add('fadeOut');
            setTimeout(function() {
                window.location.href= "home.html";
            }, 1000); // Wait for 1 second for the animation to complete
        } else if (request.message === 'loggedIn') {
            document.body.classList.add('fadeOut');
            setTimeout(function() {
                window.location.href= "popup.html";
            }, 1000); // Wait for 1 second for the animation to complete
        } else if (request.message === 'newUser') {
            document.body.classList.add('fadeOut');
            setTimeout(function() {
                window.location.href= "createUser.html";
            }, 1000); // Wait for 1 second for the animation to complete
        }
    });
};