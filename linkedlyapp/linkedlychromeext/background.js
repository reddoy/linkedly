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

async function checkLogin() {
  const data = await chrome.storage.local.get('token');
  if (data.token) {
    console.log('User is already logged in');
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + data.token);
      const data = await response.json();
      console.log(data);
      chrome.runtime.sendMessage({message:"alreadyLoggedIn"});
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    console.log('User is not logged in');
  }
}

async function runLogin() {
  try {
    const token = await chrome.identity.getAuthToken({interactive: true});
    console.log('Token acquired:', token);
    await chrome.storage.local.set({token: token});
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
    const response = await fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token);
    await chrome.identity.removeCachedAuthToken({token: token});
    await chrome.storage.local.remove('token');
    console.log('Token revoked:', token);
    console.log('Token removed from local storage.');
    chrome.runtime.sendMessage({message: 'loggedOut'});
  } catch (error) {
    console.error('Error:', error);
  }
}

