

window.onload = async function() {
  insertCurUserInfo();
  let userid = await chrome.storage.local.get('user');
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

  document.getElementById('payment-info').addEventListener('click', function() {
    chrome.tabs.create({url: 'https://billing.stripe.com/p/login/28o5nbf7T6bn6aI3cc'});
  });

  document.getElementById('logout').addEventListener('click', async function() {
    try {
      const response = await new Promise(resolve => {
        chrome.runtime.sendMessage({message: "logout"}, resolve);
      });
      window.location.href = '../pageLogin/home.html';
    } catch (error) {
      console.error(error);
    }
  });


};

async function insertCurUserInfo(){
  let userid = await chrome.storage.local.get('user');
  console.log(userid.user);
  let userinfo = await fetch('http://146.190.118.126:3000/get/userinfo/'+ userid.user);
  let userJson = await userinfo.json();
  document.getElementById('fName').value = userJson.firstname;
  document.getElementById('lName').value = userJson.lastname;
  document.getElementById('school').value = userJson.edu;
  document.getElementById('occup').value = userJson.occup;
  document.getElementById('purp').value = userJson.purpose;
  document.getElementById('goal').value = userJson.goal;
}


