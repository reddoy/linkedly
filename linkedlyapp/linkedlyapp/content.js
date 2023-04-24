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