import { IValidation, IValidationForm } from '../../types';
export class Validation implements IValidation {
	input: HTMLInputElement;
	span: string;
	name: string;
	message: string;
	errors: boolean;

	active = () => {
		this.errors = true;
	};

	inactive = () => {
		this.errors = false;
	};
	valid = () => {
		this.active();
		const spanHTML = document.querySelector(this.span);
		spanHTML.textContent = this.message;
		if (this.input.checkValidity()) {
			if (this.input.value !== '') {
				this.inactive();
			}
			spanHTML.textContent = '';
		}
	};

	constructor(
		input: HTMLInputElement,
		name: string,
		message: string,
		span: string
	) {
		this.span = span;
		this.name = name;
		this.message = message;
		this.errors = true;
		this.input = input;
	}
}

export class ValidationForm implements IValidationForm {
	input: Validation[];
	button: HTMLButtonElement;
	invalid: boolean;
	constructor(input: Validation[], button: HTMLButtonElement) {
		this.input = input;
		this.button = button;
	}
	check = () => {
		this.invalid = true;
		this.input.forEach((valid) => {
			if (valid.errors == true) {
				this.invalid = false;
			}
		});

		const buttonValid = this.button;
		if (this.invalid != true) {
			buttonValid.disabled = true;
		} else {
			buttonValid.disabled = false;
		}
	};
	clearFields = () => {
		this.input.forEach((input) => {
			input.input.value = '';
			this.button.disabled = true;
		});
	};
}
