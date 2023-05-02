window.onload = function(){
    const inputBox = document.querySelector('.input-box');
const upArrow = inputBox.querySelector('.up-arrow');
const downArrow = inputBox.querySelector('.down-arrow');
const optionsInput = inputBox.querySelector('#options');

upArrow.addEventListener('click', () => {
  const currentValue = optionsInput.value;
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const currentIndex = options.indexOf(currentValue);
  if (currentIndex < options.length - 1) {
    optionsInput.value = options[currentIndex + 1];
  }
});

downArrow.addEventListener('click', () => {
  const currentValue = optionsInput.value;
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const currentIndex = options.indexOf(currentValue);
  if (currentIndex > 0) {
    optionsInput.value = options[currentIndex - 1];
  }
});
}