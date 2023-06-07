// Grab the main element
const mainElement = document.querySelector('main');

// Get an array of all the section tags within the main element
const sectionElements = mainElement.querySelectorAll('section');

// Initialize an empty array to store the text
const textArray = [];

// Loop through the section elements and check if any have a div with the id "education"
sectionElements.forEach(section => {
  const educationDiv = section.querySelector('#education');
  if (educationDiv) {
    // Find all the li tags within the ul inside the education div
    const liElements = section.querySelectorAll('div.pvs-list__outer-container > ul > li');
    
    // Loop through the li elements and grab the desired text
    liElements.forEach(li => {
      const textElement = li.querySelector('div > div.display-flex.flex-column.full-width.align-self-center > div.display-flex.flex-row.justify-space-between > a > div > span > span:nth-child(1)');
      
      if (textElement) {
        const text = textElement.textContent;
        textArray.push(text);
      }
    });
  }
});

// Print the text array
console.log(textArray);
