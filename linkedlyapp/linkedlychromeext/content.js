

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.message === "genConnect"){
    let personArr = getPageEles();
    let jsonPerson = {
      message: 'grabbedInfo',
      curName: personArr[0],
      schools: getEducation(),
      workExperience: getWorkExperience(),
      isMemberPremium: personArr[3],
      curHeadline: personArr[5],
      curAbout: personArr[9],
    };
    sendResponse(jsonPerson);
  }
  sendResponse({message: "Response from content script"});
});

function getPageEles(){
  let personArr = [];
  const curName = document.querySelector('.text-heading-xlarge');
  const curCompany = document.querySelector('div.ph5 > div.mt2.relative > ul > li > button > span > div');
  const possibleSchool = document.querySelector('div.ph5.pb5 > div.mt2.relative > ul > li:nth-child(2) > button > span > div');
  const isMemberPremium = document.querySelector('.pv-member-badge');
  const curDistance = document.querySelector('.dist-value');
  const curHeadline = document.querySelector('.text-body-medium');
  const curHashLine = document.querySelector('div.ph5.pb5 > div.mt2.relative > div:nth-child(1) > div.text-body-small.t-black--light.break-words.mt2 > span:nth-child(1)');
  const curLocation = document.querySelector("div.ph5.pb5 > div.mt2.relative > div.pv-text-details__left-panel.mt2 > span.text-body-small.inline.t-black--light.break-words");
  const connectCount = document.querySelector("div.ph5.pb5 > ul > li:nth-child(2) > span > span");
  const about = document.querySelector("div.display-flex.ph5.pv3 > div > div > div > span:nth-child(1)");
  const followerCount = document.querySelector("div.pvs-header__container > div > div > div > p > span:nth-child(1)");

  for (let ele of [curName, curCompany, possibleSchool, isMemberPremium, curDistance, curHeadline, curHashLine, curLocation, connectCount, about, followerCount]){
    if (ele == null){
      personArr.push(null);
    }
    else{
      personArr.push(ele.textContent.trim());
    }
  }
  return personArr;
}

function getEducation(){
  const mainElement = document.querySelector('main');
  const sectionElements = mainElement.querySelectorAll('section');
  const textArray = [];
  sectionElements.forEach(section => {
    const educationDiv = section.querySelector('#education');
    if (educationDiv) {
      const liElements = section.querySelectorAll('div.pvs-list__outer-container > ul > li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column');
      
      liElements.forEach(li => {              
        const textElement = li.querySelector('div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > div > div > div > div > span:nth-child(1)');
        if (textElement) {
          const text = textElement.textContent.toLowerCase().trim();
          textArray.push(text);
        }
      });
    }
  });
  return textArray;
}



function getWorkExperience() {
  const mainElement = document.querySelector('main');
  const sectionElements = mainElement.querySelectorAll('section');
  let textArray = [];
  sectionElements.forEach(section => {
    const experienceDiv = section.querySelector('#experience');

    if (experienceDiv) {                                                                   
      const liElements = section.querySelectorAll('div.pvs-list__outer-container > ul > li.artdeco-list__item.pvs-list__item--line-separated.pvs-list__item--one-column');
      liElements.forEach(li => {
        const workTitleElement = li.querySelector('div > div.display-flex.flex-column.full-width.align-self-center > div > div.display-flex.flex-column.full-width > div > div > div > div > span:nth-child(1)');
        const workCompanyElement = li.querySelector('div > div.display-flex.flex-column.full-width.align-self-center > div > div.display-flex.flex-column.full-width > span:nth-child(2) > span:nth-child(1)');
        const multiJobEntry = li.querySelector('div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > span:nth-child(2) > span:nth-child(1)');
        if(multiJobEntry != null){
          if(multiJobEntry.innerText.includes(" yr") || multiJobEntry.innerText.includes(" mos ")){
            let firstWork = li.querySelector('div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > div > div > div > div > span:nth-child(1)');
            textArray.push(firstWork.innerText.toLowerCase().trim());
          }
        }
        else if (workTitleElement|| workCompanyElement) {
          let workCompany = workCompanyElement.textContent.toLowerCase().trim();
          if (workCompany.includes(" · ")){
            workCompany = workCompany.split(" · ")[0];
          }
          textArray.push(workCompany);
        }
      });
    }
  });
  return textArray;
}