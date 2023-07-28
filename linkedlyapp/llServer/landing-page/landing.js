let textArray = ['connect faster.', 'find email addresses.', 'stay organized.'];
let arrayIndex = 0;
let charIndex = 0;

function typeText() {
  if (charIndex < textArray[arrayIndex].length) {
    document.getElementById('animatedText').textContent += textArray[arrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 75);
  } else {
    setTimeout(deleteText, 1000);
  }
}

function deleteText() {
  if (charIndex !== 0) {
    let tempString = textArray[arrayIndex].substring(0, charIndex - 1);
    document.getElementById('animatedText').textContent = tempString;
    charIndex--;
    setTimeout(deleteText, 50);
  } else {
    arrayIndex++;
    if (arrayIndex >= textArray.length) {
      arrayIndex = 0;
    }
    setTimeout(typeText, 1000);
  }
  
  // Add a space after deleting all the text
  if (charIndex === 0 && arrayIndex === 0) {
    document.getElementById('animatedText').textContent = ' ';
  }
}

window.setTimeout(function() {
  typeText();
}, 0);

var container = document.querySelector('.scroll-snap-container');
container.addEventListener('scroll', function() {
  var nav = document.querySelector('.nav');
  var footer = document.querySelector('.footer');
  var logoH1 = document.querySelector('.logo h1');
  var logoImg = document.querySelector('.logo img');
  var footerRect = footer.getBoundingClientRect();
  var containerRect = container.getBoundingClientRect();

  if (footerRect.bottom <= containerRect.bottom) {
    // Footer is about to enter the viewport, so hide the nav and animate the logo.
    nav.style.opacity = '0';
    nav.style.transition = 'opacity 0.5s';
    logoH1.classList.add('animate');
    logoImg.classList.add('animate');
  } else {
    // Footer is not yet visible in the viewport, so show the nav and remove the logo animation.
    nav.style.opacity = '1';
    nav.style.transition = 'opacity 0.5s';
    logoH1.classList.remove('animate');
    logoImg.classList.remove('animate');
  }
  
});
