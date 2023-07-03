
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
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    const checkData = await response.json();
    let userid = checkData.id;
    console.log('got a user'+ userid);
    await chrome.storage.local.set({user: userid});
    const userResponse = await fetch('http://146.190.118.126:3000/check/user/' + userid);
    const userData = await userResponse.text();
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
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
    await chrome.storage.local.set({token: token}); // Store the token in chrome.storage
    const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    const data = await response.json();
    let userid = data.id;
    await chrome.storage.local.set({user: userid}); // Store the token in chrome.storage
    let userResponse = await fetch('http://146.190.118.126:3000/check/user/' + userid);
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
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({interactive: false}, function(token) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });

    if (!await isTokenValid(token)) {
      throw new Error('Token is not valid');
    }
    const response = await fetch('https://accounts.google.com/o/oauth2/revoke?token=' + token);
    await new Promise((resolve, reject) => {
      chrome.identity.removeCachedAuthToken({token: token}, function() {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
    await chrome.storage.local.remove('token');
    await chrome.storage.local.remove('user');
    chrome.runtime.sendMessage({message: 'loggedOut'});
  } catch (error) {
    console.error('Error:', error);
  }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "openLink") {
    chrome.tabs.create({url: request.url});
  }
});

async function isTokenValid(token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
  const data = await response.json();
  if (data.error) {
    return false;
  }
  return true;
}