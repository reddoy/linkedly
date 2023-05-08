const port = chrome.runtime.connect({name: "genEmails"});

port.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "popupGenEmails"){
      genEmails();
    }
  }
);

console.log("Content script loaded and ready");

function addScores(){
  // get all elements with class "entity-result"
  const entityResultElements = document.getElementsByClassName("entity-result");

  // loop through each element and get the child element with class "display-flex"
  for (let i = 0; i < entityResultElements.length; i++) {
  const displayFlexElement = entityResultElements[i].getElementsByClassName("display-flex")[2];
  const textBox = displayFlexElement.getElementsByClassName("entity-result__title-line entity-result__title-line--2-lines ");

  // change textBox to flex and add center the elements within it
    textBox[0].style.display = "flex";
    textBox[0].style.justifyContent = "center";
    textBox[0].style.alignItems = "center";
  const rezScore = document.createElement("p");
  rezScore.innerText = Math.floor(Math.random() * 100);

  // add style to rezScore
  rezScore.style.background = "linear-gradient(to bottom right, #87CEEB, #7B68EE)";
  rezScore.style.borderRadius = "10px";
  rezScore.style.color = "white";
  rezScore.style.textAlign = "center";
  rezScore.style.lineHeight = "40px";
  rezScore.style.width = "40px";
  rezScore.style.height = "40px";
    rezScore.style.marginLeft = "10px";
  displayFlexElement.justifyContent = "center";
  displayFlexElement.appendChild(rezScore);
  // do something with the "display-flex" element
  console.log(displayFlexElement);
    }
}


function genEmails() {
  console.log("genEmails function called");
  let curName = document.querySelector('.text-heading-xlarge');

  if (curName) {
    console.log("this is the curName and it passed: "+ curName.innerText);
    curName = curName.innerText;
    let curCompany = document.querySelector(' #ember28 > div.ph5.pb5 > div.mt2.relative > ul > li > button > span > div').innerText.trim();
    try {                                   
      port.runtime.sendMessage({message: "genEmails", curName: curName, curCompany: curCompany});
    } catch (error) {
      console.log(error);
    }
  }
  else{
    console.log("curname failed");
  }
}


function insertResponseScore(){
  const nameSection = document.querySelector('div.ph5.pb5 > div.mt2.relative > div:nth-child(1) > div:nth-child(1)')
  nameSection.style.display = "flex";
  nameSection.style.flex_direction = "row";
  const responseScore = document.createElement("p");
  responseScore.innerText = Math.floor(Math.random() * 100);
  responseScore.style.background = "linear-gradient(to bottom right, #87CEEB, #7B68EE)";
  responseScore.style.borderRadius = "10px";
  responseScore.style.color = "white";
  responseScore.style.textAlign = "center";
  responseScore.style.lineHeight = "40px";
  responseScore.style.width = "40px";
  responseScore.style.height = "40px";
  responseScore.style.marginLeft = "10px";
  nameSection.appendChild(responseScore);
}


function calculateLinkScore(){
  const curCompany = document.querySelector('div.ph5 > div.mt2.relative > ul > li > button > span > div');
  const possibleSchool = document.querySelector('div.ph5.pb5 > div.mt2.relative > ul > li:nth-child(2) > button > span > div');
  const isMemberPremium = document.querySelector('.pv-member-badge');
  const curName = document.querySelector('.text-heading-xlarge');
  const curDistance = document.querySelector('.dist-value');
  const curHeadline = document.querySelector('.text-body-medium');
  const curHashLine = document.querySelector('div.ph5.pb5 > div.mt2.relative > div:nth-child(1) > div.text-body-small.t-black--light.break-words.mt2 > span:nth-child(1)');
  const curLocation = document.querySelector("div.ph5.pb5 > div.mt2.relative > div.pv-text-details__left-panel.mt2 > span.text-body-small.inline.t-black--light.break-words");
  const connectCount = document.querySelector("div.ph5.pb5 > ul > li:nth-child(2) > span > span");
  const about = document.querySelector("div.display-flex.ph5.pv3 > div > div > div > span:nth-child(1)");
  const followerCount = document.querySelector("div.pvs-header__container > div > div > div > p > span:nth-child(1)");
  const experiences = document.querySelector("div.pvs-list__outer-container > ul > li:nth-child(1) > div > div.display-flex.flex-column.full-width.align-self-center");
  
  let memberInfo = [curName, curCompany, isMemberPremium, curDistance, curHeadline, curLocation, connectCount, about, followerCount];

  for(let info of memberInfo){
    if (info == null){
      console.log("this is null");
    }
    else{
      console.log(info.textContent.trim());
    }
  }

  const pvList = document.querySelector('.pvs-list');
  const artdecoItems = pvList.querySelectorAll('.artdeco-list__item');
  
  for(const artdecoItem of artdecoItems) {
    let linkElement = artdecoItem.querySelector('li > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > div > span > span.visually-hidden');
    
    if (linkElement != null) {
      console.log(linkElement.textContent.trim());
    }else{
      linkElement = artdecoItem.querySelector("li > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > div.display-flex.flex-column.full-width > span:nth-child(2) > span.visually-hidden");
      console.log(linkElement.textContent.trim());
    }
    
    let timeAtJob = artdecoItem.querySelector("li > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > span > span.visually-hidden");
    
    if (timeAtJob != null) {
      console.log(timeAtJob.textContent.trim());
    }else{
      timeAtJob = artdecoItem.querySelector("li > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > div.display-flex.flex-column.full-width > span:nth-child(3) > span.visually-hidden");
      console.log(timeAtJob.textContent.trim());
    }

    let jobArr = artdecoItem.querySelector(".pvs-list");
    let jobEle = jobArr.querySelectorAll("div.display-flex.flex-column.full-width.align-self-center");
    console.log('this is jobEle' + jobEle);
    for (let job of jobEle){
      console.log(job);
      console.log(job.querySelector("li > div > div.display-flex.flex-column.full-width.align-self-center > div.pvs-list__outer-container > ul > li > div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > div > span > span.visually-hidden"));
    }
  }
}

function personalInfo(){
  const pvList = document.querySelector('div.pvs-list__outer-container > ul');
  const artdecoItems = pvList.querySelectorAll('.artdeco-list__item');

  for( let job of artdecoItems){
    console.log(job);
  }
}