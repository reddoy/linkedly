console.log("Background script loaded and ready");

chrome.identity.getAuthToken({interactive: false}, function(token) {
  if (token) {
    console.log('User is already logged in');
    // You can now use the token to access Google APIs.
    fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
      .then(response => response.json())
      .then(data => {
        console.log(data); // This will log the user's profile information to the console.
      })
      .catch(error => console.error('Error:', error));
  } else {
    console.log('User is not logged in');
    // You can show a login button or other UI to prompt the user to log in.
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'login') {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      } else {
        console.log('Token acquired:', token);
        // You can now use the token to access Google APIs.
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
          .then(response => response.json())
          .then(data => {
            console.log(data); // This will log the user's profile information to the console.
          })
          .catch(error => console.error('Error:', error));
      }
    });
  } else if (request.message === 'logout') {
    chrome.identity.getAuthToken({interactive: false}, function(token) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
      } else {
        chrome.identity.removeCachedAuthToken({token: token}, function() {
          console.log('Token revoked:', token);
          chrome.runtime.sendMessage({message: 'loggedOut'});
        });
      }
    });
  }
});