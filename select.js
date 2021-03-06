// rendering our own custom select element
export default class Select {
	constructor(element) {
		this.element = element;
		this.options = getFormattedOptions(element.querySelectorAll('option'));
		this.customElementContainer = document.createElement('div'); // container for our custom select element
		this.customElementValue = document.createElement('span'); // current value of our custom select element
		this.customElementOptions = document.createElement('ul'); // options list of our custom select element

		// using our custom select element and displaying it
		setupCustomElement(this);
		element.style.display = 'none'; // hide original select HTML element
		element.after(this.customElementContainer);
	}

	// returns the selected option
	get selectedOption() {
		return this.options.find((option) => option.selected);
	}

	// returns the selected option's index
	get selectedOptionIndex() {
		return this.options.indexOf(this.selectedOption);
	}

	selectValue(value) {
		const newSelectedOption = this.options.find((option) => {
			return option.value === value;
		});
		const previousSelectedOption = this.selectedOption;
		previousSelectedOption.selected = false;
		previousSelectedOption.element.selected = false;

		newSelectedOption.selected = true;
		newSelectedOption.element.selected = true;

		this.customElementValue.innerText = newSelectedOption.label;

		this.customElementOptions
			.querySelector(`[data-value="${previousSelectedOption.value}"]`)
			.classList.remove('selected');
		const newCustomElement = this.customElementOptions.querySelector(`[data-value="${newSelectedOption.value}"]`);
		newCustomElement.classList.add('selected');
		newCustomElement.scrollIntoView({ block: 'nearest' });
	}
}

// creating our custom select element
function setupCustomElement(select) {
	select.customElementContainer.tabIndex = 0;
	select.customElementContainer.classList.add('custom-select-container');
	select.customElementValue.classList.add('custom-select-value');
	select.customElementValue.innerText = select.selectedOption.label;
	select.customElementContainer.append(select.customElementValue);

	select.customElementOptions.classList.add('custom-select-options');

	// displaying our options list
	select.options.forEach((option) => {
		const optionElement = document.createElement('li');
		optionElement.classList.add('custom-select-option');
		optionElement.classList.toggle('selected', option.selected);
		optionElement.innerText = option.label;
		optionElement.dataset.value = option.value;

		// adding event listener to each option
		optionElement.addEventListener('click', () => {
			select.selectValue(option.value);
			select.customElementOptions.classList.remove('open');
			select.customElementContainer.blur();
		});
		select.customElementOptions.append(optionElement);
	});
	select.customElementContainer.append(select.customElementOptions);

	// add event listener to open/close options
	select.customElementValue.addEventListener('click', (event) => {
		select.customElementOptions.classList.toggle('open');
	});

	// add event listener to close options when clicking outside
	select.customElementContainer.addEventListener('blur', () => {
		select.customElementOptions.classList.remove('open');
		select.customElementContainer.classList.remove('focus');
	});

	// add variables for keyboard navigation (search)
	let debounceTimeout;
	let searchString = '';

	// add event listener for keyboard navigation
	select.customElementContainer.addEventListener('keydown', (event) => {
		switch (event.code) {
			case 'Space':
				select.customElementOptions.classList.toggle('open');
				break;
			case 'ArrowUp':
				const previousOption = select.options[select.selectedOptionIndex - 1];
				if (previousOption) {
					select.selectValue(previousOption.value);
				}
				break;
			case 'ArrowDown':
				const nextOption = select.options[select.selectedOptionIndex + 1];
				if (nextOption) {
					select.selectValue(nextOption.value);
				}
				break;
			case 'Enter':
			case 'Escape':
				select.customElementOptions.classList.remove('open');
				select.customElementContainer.blur();
				break;
			default:
				clearTimeout(debounceTimeout);
				searchString += event.key;
				debounceTimeout = setTimeout(() => {
					searchString = '';
				}, 500);

				// search for the first option that starts with the search string
				const searchOption = select.options.find((option) => {
					return option.label.toLowerCase().startsWith(searchString);
				});
				if (searchOption) {
					select.selectValue(searchOption.value);
				}
		}
	});
}

// getting our options so that we can display them in our custom select element
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
