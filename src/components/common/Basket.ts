import { IBasket, IDataBasket } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { Product } from './Card';

export class Basket implements IBasket {
	items: Product[] = [];
	total: string;
	button: HTMLButtonElement;

	basketSubmitClear = () => {
		this.items = [];
		this.total = '0';
	};

	sum = () => {
		let total = 0;
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].price == null) {
				return 'Бесценно';
				break;
			}
			total += Number(this.items[i].price);
		}
		this.total = String(total);
		return String(total) + ' синапсов';
	};

	deleteBasket = (
		element: HTMLElement,
		item: Product,
		dataBasket: IDataBasket
	) => {
		this.items = this.items.filter((obj) => obj.id !== item.id);
		this.headerInsertion(dataBasket.headerClass);
		this.clearBasket();
		this.render(dataBasket);
	};

	clearBasket = () => {
		const element = document.querySelector('.basket__list');
		element.innerHTML = '';
	};

	render = (dataBasket: IDataBasket) => {
		this.items.forEach((item, index) => {
			const conteinerBasket = document.querySelector(dataBasket.container);
			const templateHTML = cloneTemplate(dataBasket.template);
			const indexHTML = templateHTML.querySelector(dataBasket.indexClass);
			const titleHTML = templateHTML.querySelector(dataBasket.titleClass);
			const priceHTML = templateHTML.querySelector(dataBasket.priceClass);
			const buttonHTML = templateHTML.querySelector(dataBasket.buttonClass);

			titleHTML.textContent = item.title;
			indexHTML.textContent = String(index + 1);
			buttonHTML.addEventListener('click', () => {
				this.deleteBasket(templateHTML, item, dataBasket);
				this.inactive();
			});
			if (item.price !== null) {
				priceHTML.textContent = item.price + ' ' + 'синапсов';
			} else {
				priceHTML.textContent = 'Бесценно';
			}
			conteinerBasket.append(templateHTML);
		});
		const totalHTML = document.querySelector(dataBasket.totalClass);
		totalHTML.textContent = this.sum();
	};

	headerInsertion(indexHeaderClass: string) {
		const indexHeaderHTML = document.querySelector(indexHeaderClass);
		indexHeaderHTML.textContent = String(this.items.length);
	}

	inactive = () => {
		const paymentButtonHTML = this.button;
		paymentButtonHTML.disabled = false;
		if (this.items.length == 0) {
			paymentButtonHTML.disabled = true;
		}
	};
	constructor(button: HTMLButtonElement) {
		this.button = button;
	}
	items_to_id = () => {
		const id_list: string[] = [];
		this.items.forEach((item) => {
			id_list.push(item.id);
		});
		return id_list;
	};
}
