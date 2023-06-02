 const jwt = require('jsonwebtoken');

window.onload = async function () {
  try {
    const data = await chrome.storage.local.get('token');
    const token = data.token;
    let decoded = jwt.decode(token);
    console.log('Token acquired in createUser:', decoded);
    if (!token) {
      throw new Error('Token not found in storage');
    }
    const userInfo = await chrome.identity.getProfileUserInfo();
    console.log(userInfo);
    const userId = userInfo.id;
    console.log('this is the user id in create User:' + userId);
    const userIdInput = document.getElementById('userId');
    userIdInput.value = userId;
  } catch (error) {
    console.error(error);
  }
}