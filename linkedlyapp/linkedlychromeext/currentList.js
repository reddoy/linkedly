

window.onload = function(){
    displayCurList();
}

// create a function that gets the current personList from chrome storage
// and loops through the list and display each element
function displayCurList(){
    chrome.storage.local.get(["personList"], function(result) {
        console.log(result.personList);
        if (result.personList) {
            personArr = result.personList;
        } else {
            personArr = [];
        }
        for (let i = 0; i < personArr.length; i++) {
            let person = personArr[i];
            let email = person[0];
            let linkedUrl = person[1];
            let note = person[2];
            let personDiv = document.getElementById('curListEntries');
            personDiv.innerHTML = `
                <div class="entry">
                    <div class="info">
                        <p class="person-email">${email}</p>
                        <p class="person-link"><a href="${linkedUrl}" target="_blank">${linkedUrl}</a></p>
                        <p class="person-note">${note}</p>
                    </div>
                    <div class="person-actions">
                        <button class="btn btn-primary">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                    </div>
                </div>
            `;
        }
      });
}