

window.onload = async function () {
  try {
    const data = await chrome.storage.local.get('user');
    const curUser = data.user;
    console.log(curUser);
    if (!curUser) {
      throw new Error('User not found in storage');
    }
    const userId = curUser;
    console.log(`this is the user id in create User: ${curUser}`);
    const userIdInput = document.getElementById('userId');
    userIdInput.value = userId;

    // Save the form data to Chrome storage
    const form = document.getElementById('userForm');
    form.addEventListener('submit', function (event) {
      const formData = new FormData(form);
      chrome.storage.local.set({ formData: Object.fromEntries(formData) }, function () {
        console.log('Form data saved to Chrome storage');
      });
    });
  } catch (error) {
    console.error(error);
  }
};