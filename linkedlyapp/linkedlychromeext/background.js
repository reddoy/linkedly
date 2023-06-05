console.log("Background script loaded and ready");


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'logout') {
    console.log('logging out');
    runLogout();
  } else if (request.message === 'login') {
    console.log('logging in');
    runLogin();
  } else if (request.message === 'checkLogin'){
    console.log('checking login');
    checkLogin();
  }
});

async function checkLogin() {
  try {
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ 'interactive': false }, function(token) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
    console.log('User is already logged in');
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    const checkData = await response.json();
    let userid = checkData.id;
    console.log('this is the user id:' + userid);
    const userResponse = await fetch('http://127.0.0.1:3000/check/user/' + userid);
    const userData = await userResponse.text();
    console.log('was a user found? ' + userData);
    if (userData === 'nouser') {
      chrome.runtime.sendMessage({message:"newUser"});
    } else {
      chrome.runtime.sendMessage({message:"loggedIn"});
    }
  } catch (error) {
    chrome.runtime.sendMessage({message:"notLoggedIn"});
    console.error('Error:', error);
  }
}

async function runLogin() {
  try {
    const token = await chrome.identity.getAuthToken({interactive: true});
    console.log('Token acquired:', token);
    await chrome.storage.local.set({token: token}); // Store the token in chrome.storage
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    const data = await response.json();
    console.log(data);
    let userid = data.id;
    let userResponse = await fetch('http://localhost:3000/check/user/' + userid);
    let userData = await userResponse.text();
    if (userData === 'nouser') {
      chrome.runtime.sendMessage({message:"newUser"});
    } else {
      chrome.runtime.sendMessage({message:"loggedIn"});
    }
  } catch (error) {
    console.log(error.message);
  }
}

async function runLogout() {
  try {
    const token = await chrome.identity.getAuthToken({interactive: false});
    console.log('Token acquired:', token.token );
    const response = await fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token.token);
    await chrome.identity.removeCachedAuthToken({token: token.token});
    await chrome.storage.local.remove('token');
    console.log('Token revoked:', token);
    console.log('Token removed from local storage.');
    chrome.runtime.sendMessage({message: 'loggedOut'});
  } catch (error) {
    console.error('Error:', error);
  }
}

