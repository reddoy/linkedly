

window.onload = async function () {
  try {
    const data = await chrome.storage.local.get('user');
    const curUser = data.user;
    if (!curUser) {
      throw new Error('User not found in storage');
    }
    const userId = curUser;
    const userIdInput = document.getElementById('userId');
    userIdInput.value = userId;
  } catch (error) {
    console.error(error);
  }
};