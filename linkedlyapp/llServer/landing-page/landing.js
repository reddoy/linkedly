let textArray = ['connect faster.', 'find email addresses.', 'stay organized.'];
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
  if (charIndex !== 0) {
    let tempString = textArray[arrayIndex].substring(0, charIndex - 1);
    document.getElementById('animatedText').textContent = tempString;
    charIndex--;
    setTimeout(deleteText, 100);
  } else {
    arrayIndex++;
    if (arrayIndex >= textArray.length) {
      arrayIndex = 0;
    }
    setTimeout(typeText, 2000);
  }
  
  // Add a space after deleting all the text
  if (charIndex === 0 && arrayIndex === 0) {
    document.getElementById('animatedText').textContent = ' ';
  }
}

window.setTimeout(function() {
  typeText();
}, 0);
