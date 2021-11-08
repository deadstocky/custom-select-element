import Select from './select.js';

// creating custom class and linking to current HTML select element
const selectElement = document.querySelectorAll('[data-custom]');

selectElement.forEach((selectElement) => {
	new Select(selectElement);
});
