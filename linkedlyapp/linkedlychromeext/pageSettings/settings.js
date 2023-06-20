

window.onload = function() {
    document.getElementById('homeBtn').onclick = function() {
        window.location.href = 'popup.html';
    };
    insertCurUserInfo();

    const form = document.getElementById('userForm');
    form.addEventListener('submit', function (event) {
      const formData = new FormData(form);
      chrome.storage.local.set({ formData: Object.fromEntries(formData) }, function () {
        console.log('Form data saved to Chrome storage');
      });
    });
};

async function insertCurUserInfo(){
    chrome.storage.local.get('formData', function(data) {
        const userInfo = data.formData;
        document.getElementById('fName').value = userInfo.firstName;
        document.getElementById('lName').value = userInfo.lastName;
        document.getElementById('school').value = userInfo.school;
        document.getElementById('occup').value = userInfo.occupation;
        document.getElementById('goal').value = userInfo.goal;
    });
}