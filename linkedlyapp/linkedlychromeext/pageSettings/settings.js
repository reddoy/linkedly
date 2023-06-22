

window.onload = function() {
    document.getElementById('homeBtn').onclick = function() {
        window.location.href = '../pageMainPopup/popup.html';
    };
    insertCurUserInfo();

    const form = document.getElementById('userForm');
    form.addEventListener('submit', function (event) {
      const formData = new FormData(form);
      chrome.storage.local.set({ formData: Object.fromEntries(formData) }, function () {
        console.log('Form data saved to Chrome storage');
      });
    });

document.getElementById('logout').addEventListener('click', async function() {
  try {
    const response = await new Promise(resolve => {
      chrome.runtime.sendMessage({message: "logout"}, resolve);
    });
    console.log('this is the response from background:' + response);
    window.location.href = '../pageLogin/home.html';
  } catch (error) {
    console.error(error);
  }
});
};

async function insertCurUserInfo(){
    chrome.storage.local.get('formData', function(data) {
        const userInfo = data.formData;
        document.getElementById('fName').value = userInfo.firstName;
        document.getElementById('lName').value = userInfo.lastName;
        document.getElementById('school').value = userInfo.school;
        document.getElementById('occup').value = userInfo.occupation;
        document.getElementById('purp').value = userInfo.purpose;
        document.getElementById('goal').value = userInfo.goal;
    });
}

