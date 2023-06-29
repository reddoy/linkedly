window.onload = function(){
    displayCurList();

    document.getElementById('clearListBtn').addEventListener('click', function(){
        chrome.storage.local.clear(function() {
            console.log("personList cleared");
            // write code that changes the text of clearListBtn to say "List Cleared"
            // for 1 second then changes back to "Clear List"
            let clearListBtn = document.getElementById('clearListBtn');
            clearListBtn.innerHTML = "List Cleared";
            displayCurList();
            setTimeout(function(){
                clearListBtn.innerHTML = "Clear List";
            }, 1000);
        });
    });

    document.getElementById('downloadListBtn').addEventListener('click', function(){
        chrome.storage.local.get(["personList"], function(result) {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Name,Profile Link,Email,Note\r\n";
            for (let rowArray of result.personList) {
                let name = rowArray[0];
                let profLink = rowArray[1];
                let emails = rowArray[2];
                let note = rowArray[3];
                csvContent += `${name}, ${profLink}, "${emails}", "${note}"\r\n`;
            }
            console.log(csvContent);
            // var encodedUri = encodeURI(csvContent);
            // var link = document.createElement('a');
            // link.setAttribute('href', encodedUri);
            // link.setAttribute('download', 'personList.csv');
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
        });
    });
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
        let tableBody = document.getElementById('main-body');
        tableBody.innerHTML = '';
        for (let person of personArr) {
            let fullname = person[0];
            let linkedUrl = person[1];
            let emailString = person[2];
            let note = person[3];

            // Create a new row
            let row = document.createElement('div');
            row.className = 'row';

            // Create cells and add them to the row
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

            // Add the row to the table body
            tableBody.appendChild(row);
            deleteButton.addEventListener('click', function() {
                // Replace the delete button with a confirmation
                deleteCell.innerHTML = 'Are you sure? <button class="confirm">Yes</button> <button class="cancel">No</button>';

                // Add event listeners to the confirmation buttons
                deleteCell.querySelector('.confirm').addEventListener('click', function() {
                    // Remove the person from the array
                    personArr.splice(personArr.indexOf(person), 1);

                    // Update the array in chrome.storage
                    chrome.storage.local.set({personList: personArr}, function() {
                        console.log('Person deleted.');

                        // Refresh the table
                        displayCurList();
                    });
                });

                deleteCell.querySelector('.cancel').addEventListener('click', function() {
                    // Cancel the deletion - replace the confirmation with the delete button
                    deleteCell.innerHTML = '';
                    deleteCell.appendChild(deleteButton);
                });
            });
        }

        // ... (same as before)
        let links = document.getElementsByClassName('person-link');
        for (let link of links) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                // Send a message to the background script to open the link in a new tab
                chrome.runtime.sendMessage({action: "openLink", url: this.getAttribute('href')});
            });
        }
    });
}
