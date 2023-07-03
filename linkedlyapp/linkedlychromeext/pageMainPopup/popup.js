
window.onload = async function () {
  const tl = document.getElementById("tL");
  const connectDiv = document.getElementById("info-section");
  let connectDivHTML = connectDiv.innerHTML;
  let emailOpsArr = [];
  const userid = await isUserLoggedIn();
  const curTab = await grabTab();
  const targetContent = await grabUserDataFromContent(curTab);

  getStatOnload(userid, tl);
  handleConnectBtnClick(userid, curTab, targetContent, connectDiv, tl);

  document.querySelector("html").classList.add("fade-in");

  async function getStatOnload(userid, tl) {
          let stat = await fetch(
              "http://146.190.118.126:3000/get/userstat/" + userid
          );
          let statTag = await stat.text();
          tl.innerHTML = statTag;
          if (statTag.includes("trial")) {
              let link = document.getElementById("payment-link");
              link.addEventListener("click", function () {
                  chrome.runtime.sendMessage({
                      action: "openLink",
                      url: this.getAttribute("href"),
                  });
              });
          }
  }

  function handleConnectBtnClick(userid, curTab, targetContent, connectDiv, tL) {
    document.getElementById("genConnectBtn").addEventListener("click", async function () {
        try {
            curStat = document.getElementById("tL").innerHTML;
            console.log(curStat);
            if (curStat.includes(" 0/")) {
                tL.classList.add("flash");
                setTimeout(() => {
                    tL.classList.remove("flash");
                }, 1000);
                handleConnectBtnClick(userid, curTab, targetContent, connectDiv, tL);
                return;
            }
            connectDiv.innerHTML =
                '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
            const reachData = await getMessage(targetContent);

            if (reachData[0] != "limit reached") {
                connectDiv.innerHTML = `
                    <div class="question">
                      <label for="linkUrl">Linkedin URL</label>
                      <input type="text" name="linkUrl" id="linkUrl">
                    </div>
                    <div class="question">
                      <label for="email">Email</label>
                      <div class="emailInput">
                        <input type="text" id="email" name="email" value="Use Arrows to look at Emails" disabled>
                        <div class="arrows">
                          <button class="up-arrow">&#9650;</button>
                          <button class="down-arrow">&#9660;</button>
                        </div>
                      </div>
                    </div>
                    <div class="question">
                      <label for="note">Note</label>
                      <p>Copy and Paste into the Connection Note:</p>
                      <div id="note-container">
                        <textarea name="note" id="note" cols="60" rows="5"></textarea>
                        <div class="buttons">
                          <button id="regenBtn">Regenerate</button>
                        </div>
                      </div>
                    </div>
                  `;
                document.getElementById("linkUrl").value = curTab.url.replace(/^(https?:\/\/)?/, "");
                reachData[1] = reachData[1].replace(/"/g, "");
                document.getElementById("note").value = reachData[1].replace(/\n/g, "");
                document.getElementById("fullname").innerText = targetContent.curName.trim();
                console.log(reachData[0]);
                tL.innerHTML = reachData[0];
                katiePretty(reachData[2]);
                addRegen();
                if (reachData[0].includes("trial")) {
                    let link = document.getElementById("payment-link");
                    link.addEventListener("click", function () {
                        chrome.runtime.sendMessage({
                            action: "openLink",
                            url: this.getAttribute("href"),
                        });
                    });
                }
            }
            else {
                tL.innerHTML = reachData[1];
                tL.classList.add("flash");
                setTimeout(() => {
                    tL.classList.remove("flash");
                }, 1000);
                handleConnectBtnClick(userid, curTab, targetContent, connectDiv, tL);
            }
        }
        catch (error) {
            console.error(error);
            // Handle the error here
        }
    });
  }


  async function grabTab() {
      const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
      });
      const curTab = tabs[0];
      return curTab;
  }

  async function grabUserDataFromContent(curTab) {
      const response = await new Promise((resolve) => {
          chrome.tabs.sendMessage(
              curTab.id, {
                  message: "genConnect",
              },
              resolve
          );
      });
      return response;
  }

  async function getMessage(response) {
      const userid = await isUserLoggedIn();
      const reachJson = {
          curUserId: userid,
          curName: response.curName,
          workExperience: response.workExperience,
          schools: response.schools,
          curHeadline: response.curHeadline,
          curAbout: response.curAbout,
      };
      const reachResponse = await fetch("http://146.190.118.126:3000/get/message", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(reachJson),
      });
      const reachData = await reachResponse.json();
      return reachData;
  }

  function addRegen() {
      document.getElementById("regenBtn").addEventListener("click", async function () {
          let noteContainer = document.getElementById("note-container");
          noteContainer.innerHTML =
              '<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
          const userid = await isUserLoggedIn();
          const curTab = await grabTab();
          const response = await grabUserDataFromContent(curTab);
          const regenJson = {
              curUserId: userid,
              curName: response.curName,
              workExperience: response.workExperience,
              schools: response.schools,
              curHeadline: response.curHeadline,
              curAbout: response.curAbout,
          };
          const regenResponse = await fetch(
              "http://146.190.118.126:3000/regen/message", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(regenJson),
              }
          );
          const regenData = await regenResponse.json();
          if(regenData[0] == "limit reached"){
            connectDiv.innerHTML = connectDivHTML;
            tL.innerHTML = regenData[1];
          }
          noteContainer.innerHTML ='<textarea name="note" id="note" cols="60" rows="5"></textarea><div class="buttons"><button id="regenBtn">Regenerate</button></div>';       
          document.getElementById("note").value = regenData[1].replace(/^"(.*)"$/, "$1").replace(/\n/g, "");
          document.getElementById("tL").innerHTML = regenData[0];
          addRegen();
          if (reachData[0].includes("trial")) {
              let link = document.getElementById("payment-link");
              link.addEventListener("click", function () {
                  chrome.runtime.sendMessage({
                      action: "openLink",
                      url: this.getAttribute("href"),
                  });
              });
          }
      });
  }



  function katiePretty(emailOptions) {
      emailOpsArr = emailOptions;
      let inputBox = document.querySelector(".emailInput");
      let upArrow = inputBox.querySelector(".up-arrow");
      let downArrow = inputBox.querySelector(".down-arrow");
      let optionsInput = inputBox.querySelector("#email");

      upArrow.addEventListener("click", () => {
          let currentValue = optionsInput.value;
          let options = emailOptions;
          let currentIndex = options.indexOf(currentValue);
          if (currentIndex < options.length - 1) {
              optionsInput.value = options[currentIndex + 1];
          }
      });

      downArrow.addEventListener("click", () => {
          let currentValue = optionsInput.value;
          let options = emailOptions;
          let currentIndex = options.indexOf(currentValue);
          if (currentIndex > 0) {
              optionsInput.value = options[currentIndex - 1];
          }
      });
  }

  document.getElementById("addToListBtn").addEventListener("click", function () {
    let linkedUrl = document.getElementById("linkUrl");
    if(linkedUrl){
        const addButton = document.getElementById("addToListBtn");
        const originalText = addButton.innerText;

        const fullname = document.getElementById("fullname").innerText;
        linkedUrl = linkedUrl.value;
        let emailString = emailOpsArr.join(",");
        let note = document.getElementById("note").value;

        chrome.storage.local.get(["personList"], function (result) {
            if (result.personList) {
                personArr = result.personList;
            }
            else {
                personArr = [];
            }
            personArr.push([fullname, linkedUrl, emailString, note]);
            saveListToStorage(personArr);
            addButton.innerText = "Added to List";
            setTimeout(function () {
                addButton.innerText = originalText;
            }, 1000);
        });
    }
});

  function saveListToStorage(list) {
      chrome.storage.local.set({
              personList: list,
          },
          function () {
              let addListBtn = document.getElementById("addToListBtn");
              addListBtn.value = "Added!";
              setTimeout(function () {
                  addListBtn.value = "Add to List";
              }, 1000);
          }
      );
  }

  async function isUserLoggedIn() {
      try {
          const token = await chrome.identity.getAuthToken({
              interactive: false,
          });
          if (!token) {
              window.location.href = "home.html";
              return null;
          }
          const response = await fetch(
              "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" +
              token.token
          );
          const data = await response.json();
          const userId = data.id;
          return userId;
      }
      catch (error) {
          console.log(error);
          return null;
      }
  }
};