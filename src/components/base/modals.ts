import {
	IPreviewModal,
	TPayment,
	IModalWindow,
	IModalPurchase,
} from '../../types';
import { CDN_URL } from '../../utils/constants';
import { Product } from '../common/Card';

export class ModalWindow implements IModalWindow {
	title: string;
	container: HTMLElement;
	// overlay: HTMLElement;

	constructor(container: HTMLElement, title: string) {
		this.container = container;
		this.title = title;
	}

	open = () => {
		this.container.classList.add('modal_active');
		this.container.style.position = 'fixed';
		document.body.style.overflow = 'hidden';
	};

	close = () => {
		this.container.classList.remove('modal_active');
		document.body.style.overflow = 'auto';
	};
}

export class PreviewModal extends ModalWindow implements IPreviewModal {
	product: Product;
	button: HTMLButtonElement;

	constructor(
		container: HTMLElement,
		title: string,
		button: HTMLButtonElement
	) {
		super(container, title);
		this.button = button;
	}
	transform = (product: Product) => {
		this.product = product;
	};
	render = (data: {
		titleClass: string;
		categoryClass: string;
		imageClass: string;
		priceClass: string;
		descriptionClass: string;
	}) => {
		const modal = document.querySelector('.card_full');
		const titleHTML = modal.querySelector(data.titleClass);
		const categoryHTML = modal.querySelector(data.categoryClass);
		const imageHTML = modal.querySelector(data.imageClass) as HTMLImageElement;
		const priceHTML = modal.querySelector(data.priceClass);
		const descriptionHTML = modal.querySelector(data.descriptionClass);

		titleHTML.textContent = this.product.title;
		categoryHTML.textContent = this.product.category;
		imageHTML.src = CDN_URL + this.product.image;
		if (this.product.price !== null) {
			priceHTML.textContent = this.product.price + ' ' + 'синапсов';
		} else {
			priceHTML.textContent = 'Бесценно';
		}
		descriptionHTML.textContent = this.product.description;
	};

	add = (items: Product[]) => {
		if (!items.includes(this.product)) {
			items.push(this.product);
		}
	};
}

export class ModalPurchase extends ModalWindow implements IModalPurchase {
	payment: TPayment;
	constructor(container: HTMLElement, title: string) {
		super(container, title);
	}
}
