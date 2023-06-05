

window.onload = async function () {
  try {
    const data = await chrome.storage.local.get('user');
    const curUser = data.user;
    console.log(curUser);
    if (!curUser) {
      throw new Error('User not found in storage');
    }
    const userId = curUser.id;
    console.log(`this is the user id in create User: ${userId}`);
    const userIdInput = document.getElementById('userId');
    userIdInput.value = userId;
  } catch (error) {
    console.error(error);
  }

  document.getElementById('submit').addEventListener('click', async function () {
    window.location.href = 'popup.html';
  });

};