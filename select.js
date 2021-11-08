export default class Select {
	constructor(element) {
		this.element = element;
		this.options = getFormattedOptions(element.querySelectorAll('option'));
		this.customElementContainer = document.createElement('div');
		this.customElementValue = document.createElement('span');
		this.customElementOptions = document.createElement('ul');
		setupCustomElement(this);
		element.after(this.customElementContainer);
	}
	get selectedOption() {
		return this.options.find((option) => option.selected);
	}
}

function setupCustomElement(select) {
	select.customElementContainer.classList.add('custom-select-container');

	select.customElementValue.classList.add('custom-select-value');
	select.customElementValue.innerText = select.selectedOption.label;
	select.customElementContainer.append(select.customElementValue);

	select.customElementOptions.classList.add('custom-select-options');
	select.options.forEach((option) => {
		const optionElement = document.createElement('li');
		optionElement.classList.add('custom-select-option');
		optionElement.classList.toggle('selected', option.selected);
		optionElement.innerText = option.label;
		optionElement.dataset.value = option.value;
		select.customElementOptions.append(optionElement);
	});
	select.customElementContainer.append(select.customElementOptions);
}

function getFormattedOptions(optionElements) {
	return [...optionElements].map((optionElement) => {
		return {
			label: optionElement.label,
			value: optionElement.value,
			selected: optionElement.selected,
			element: optionElement,
		};
	});
}
