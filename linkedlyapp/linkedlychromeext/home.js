window.onload = function () {
    document.getElementById("createAcctBtn").onclick = function () {
        chrome.runtime.sendMessage({message: 'login'});
    }
}