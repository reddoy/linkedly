

window.onload = async function() {
  insertCurUserInfo();
  let userid = await chrome.storage.local.get('user');
  document.getElementById('homeBtn').onclick = function() {
      window.location.href = '../pageMainPopup/popup.html';
  };
    document.getElementById('userId').value = userid.user;
    


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
  let userinfo = await fetch('https://linkedly.app/get/userinfo/'+ userid.user);
  let userJson = await userinfo.json();
  document.getElementById('fName').value = userJson.firstname;
  document.getElementById('lName').value = userJson.lastname;
  document.getElementById('school').value = userJson.edu;
  document.getElementById('occup').value = userJson.occup;
  document.getElementById('purp').value = userJson.purpose;
  document.getElementById('goal').value = userJson.goal;
}


