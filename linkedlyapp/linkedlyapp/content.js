chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "addScores")
      addScores();
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


<div class="pv-text-details__left-panel mt2">
    <span class="text-body-small inline t-black--light break-words">
      Santa Monica, California, United States
    </span>
      <span class="pv-text-details__separator t-black--light">
        <a href="/in/scott-gallo-71ba5323/overlay/contact-info/" id="top-card-text-details-contact-info" class="ember-view link-without-visited-state cursor-pointer text-heading-small inline-block break-words">
          Contact info
        </a>
      </span>
  </div>

function calculateLinkScore(){
  let isMemberPremium = document.querySelector('.pv-member-badge')  || false;
  var curName = document.querySelector('.text-heading-xlarge').innerText;
  const distance = document.querySelector('.dist-value').textContent.trim();
  const curHeadline = document.querySelector('.text-body-medium').textContent.trim();
  const location = document.querySelector("#ember28 > div.ph5.pb5 > div.mt2.relative > div.pv-text-details__left-panel.mt2 > span.text-body-small.inline.t-black--light.break-words").textContent.trim();
  const connectCount = document.querySelector("#ember28 > div.ph5.pb5 > ul > li > span").textContent.trim();
  const about = document.querySelector("#ember282 > div.display-flex.ph5.pv3 > div > div > div > span:nth-child(1)").textContent.trim();
  const text = document.querySelector().textContent.trim();
  const followerCount = document.querySelector("#ember301 > div.pvs-header__container > div > div > div > p > span:nth-child(1)").textContent.trim();
  console.log(followerCount);
  const experiences = document.querySelector("#ember284 > div.pvs-list__outer-container > ul > li:nth-child(1) > div > div.display-flex.flex-column.full-width.align-self-center").textContent.trim();
  console.log(experiences);
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