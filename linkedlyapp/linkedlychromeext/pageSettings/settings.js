

window.onload = async function() {

  const userid = await chrome.storage.local.get('user');
  insertCurUserInfo(userid.user);
  document.getElementById('homeBtn').onclick = function() {
      window.location.href = '../pageMainPopup/popup.html';
  };
    document.getElementById('userId').value = userid.user;
    

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

async function insertCurUserInfo(userid){
  console.log(userid);
  let userinfo = await fetch('http://127.0.0.1:3000/get/userinfo/'+ userid);
  let userJson = await userinfo.json();
  console.log(userJson);
  document.getElementById('fName').value = userJson.firstname;
  document.getElementById('lName').value = userJson.lastname;
  document.getElementById('school').value = userJson.edu;
  document.getElementById('occup').value = userJson.occup;
  document.getElementById('purp').value = userJson.purpose;
  document.getElementById('goal').value = userJson.goal;
}

