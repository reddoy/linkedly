let textArray = ['Hello, World!', 'This is a typing animation.', 'It will delete soon.'];
let arrayIndex = 0;
let charIndex = 0;

function typeText() {
  if (charIndex < textArray[arrayIndex].length) {
    document.getElementById('animatedText').textContent += textArray[arrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 150);
  } else {
    setTimeout(deleteText, 2000);
  }
}

function deleteText() {
  if (charIndex != 0) {
    let tempString = textArray[arrayIndex].substring(0, charIndex-1);
    document.getElementById('animatedText').textContent = tempString;
    charIndex--;
    setTimeout(deleteText, 100);
  } else {
    arrayIndex++;
    if(arrayIndex>=textArray.length)
      arrayIndex=0;
    setTimeout(typeText, 2000);
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  setTimeout(typeText, 2000);
});
