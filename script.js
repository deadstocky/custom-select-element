import Select from './select.js';

const selectElement = document.querySelectorAll('[data-custom]');

selectElement.forEach((selectElement) => {
	new Select(selectElement);
});
