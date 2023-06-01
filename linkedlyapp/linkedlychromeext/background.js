console.log("Background script loaded and ready");


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'logout') {
    runLogout();
  } else if (request.message === 'login') {
    runLogin();
  } else if (request.message === 'checkLogin'){
    checkLogin();
  }
});

function checkLogin(){
  chrome.storage.local.get('token', function(data) {
    if (data.token) {
      console.log('User is already logged in');
      // You can now use the token to access Google APIs.
      fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + data.token)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          chrome.runtime.sendMessage({message:"alreadyLoggedIn"}); // This will log the user's profile information to the console.
        })
        .catch(error => console.error('Error:', error));
    } else {
      console.log('User is not logged in');
      // You can show a login button or other UI to prompt the user to log in.
    }
  });
}


function runLogin(){
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    } else {
      console.log('Token acquired:', token);
      // Store the token in local storage.
      chrome.storage.local.set({token: token}, function() {
        console.log('Token stored in local storage.');
      });
      // You can now use the token to access Google APIs.
      fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          chrome.runtime.sendMessage({message:"loggedIn"}) // This will log the user's profile information to the console.
        })
        .catch(error => console.error('Error:', error));
    }
  });
}

function runLogout(){
  chrome.identity.getAuthToken({interactive: false}, function(token) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    } else {
      // Revoke the token.
      fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token)
        .then(() => {
          // Remove the token from Chrome's cache.
          chrome.identity.removeCachedAuthToken({token: token}, function() {
            console.log('Token revoked:', token);
            // Clear the token from local storage.
            chrome.storage.local.remove('token', function() {
              console.log('Token removed from local storage.');
              chrome.runtime.sendMessage({message: 'loggedOut'});
            });
          });
        })
        .catch(error => console.error('Error:', error));
    }
  });
}
