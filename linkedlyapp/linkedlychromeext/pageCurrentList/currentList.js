window.onload = function(){
    displayCurList();

    let clearListBtn = document.getElementById('clearListBtn');
    let downloadListBtn = document.getElementById('downloadListBtn');
    
    clearListBtn.addEventListener('click', function(){
        let confirmationMsg = document.createElement('div');
        confirmationMsg.innerHTML = "Are you sure you want to clear the list?";
        let yesBtn = document.createElement('button');
        yesBtn.innerHTML = "Yes";
        let noBtn = document.createElement('button');
        noBtn.innerHTML = "No";
        confirmationMsg.appendChild(yesBtn);
        confirmationMsg.appendChild(noBtn);
        clearListBtn.replaceWith(confirmationMsg);
        downloadListBtn.style.display = "none";
    
        yesBtn.addEventListener('click', function() {
            chrome.storage.local.remove('personList',function() {
                confirmationMsg.innerHTML = "";
                displayCurList();
                setTimeout(function(){
                    confirmationMsg.replaceWith(clearListBtn);
                    clearListBtn.innerHTML = "Clear List";
                    downloadListBtn.style.display = "inline-block";
                }, 1000);
            });
        });
    
        noBtn.addEventListener('click', function() {
            confirmationMsg.replaceWith(clearListBtn);
            downloadListBtn.style.display = "inline-block";
        });
    });

    document.getElementById('downloadListBtn').addEventListener('click', function(){
        chrome.storage.local.get(["personList"], function(result) {
            if(result.personList){
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "Name,Profile Link,Email,Note\r\n";
                for (let rowArray of result.personList) {
                    let name = rowArray[0];
                    let profLink = rowArray[1];
                    let emails = rowArray[2].replace(/,/g, ';');
                    let note = rowArray[3].replace(/,/g, ';').replace(/"/g, '""');
                    csvContent += `${name}, ${profLink}, ${emails}, "${note}"\r\n`;
                }
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', 'Linkedly.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        });
    });
    
    
    
}

function displayCurList(){
    chrome.storage.local.get(["personList"], function(result) {
        if (result.personList) {
            personArr = result.personList;
        } else {
            personArr = [];
        }
        let tableBody = document.getElementById('main-body');
        tableBody.innerHTML = '';
        for (let person of personArr) {
            let fullname = person[0];
            let linkedUrl = person[1];
            let emailString = person[2];
            let note = person[3];

            let row = document.createElement('div');
            row.className = 'row';

            let nameCell = document.createElement('div');
            nameCell.className = 'cell';
            nameCell.textContent = fullname;
            row.appendChild(nameCell);

            let urlCell = document.createElement('div');
            urlCell.className = 'cell';
            let urlLink = document.createElement('a');
            urlLink.href = `https://${linkedUrl}`;
            urlLink.target = '_blank';
            urlLink.textContent = `${fullname} Profile`;
            urlCell.appendChild(urlLink);
            row.appendChild(urlCell);

            let emailCell = document.createElement('div');
            emailCell.className = 'cell';
            emailCell.innerHTML = emailString.split(',').join('<br>');
            row.appendChild(emailCell);

            let noteCell = document.createElement('div');
            noteCell.className = 'cell';
            noteCell.textContent = note;
            row.appendChild(noteCell);

            let deleteCell = document.createElement('div');
            deleteCell.className = 'cell';
            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            tableBody.appendChild(row);
            deleteButton.addEventListener('click', function() {
                deleteCell.innerHTML = 'Are you sure? <button class="confirm">Yes</button> <button class="cancel">No</button>';

                deleteCell.querySelector('.confirm').addEventListener('click', function() {
                    personArr.splice(personArr.indexOf(person), 1);

                    chrome.storage.local.set({personList: personArr}, function() {

                        displayCurList();
                    });
                });

                deleteCell.querySelector('.cancel').addEventListener('click', function() {
                    deleteCell.innerHTML = '';
                    deleteCell.appendChild(deleteButton);
                });
            });
        }

        let links = document.getElementsByClassName('person-link');
        for (let link of links) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                chrome.runtime.sendMessage({action: "openLink", url: this.getAttribute('href')});
            });
        }
    });
}
