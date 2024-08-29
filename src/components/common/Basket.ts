import { IBasket, IBasketClassNames } from '../../types';
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
		basketClassNames: IBasketClassNames
	) => {
		this.items = this.items.filter((obj) => obj.id !== item.id);
		this.headerInsertion(basketClassNames.headerClass);
		this.clearBasket();
		this.render(basketClassNames);
	};

	clearBasket = () => {
		const element = document.querySelector('.basket__list');
		element.innerHTML = '';
	};

	render = (basketClassNames: IBasketClassNames) => {
		this.items.forEach((item, index) => {
			const conteinerBasket = document.querySelector(
				basketClassNames.container
			);
			const templateHTML = cloneTemplate(basketClassNames.template);
			const indexHTML = templateHTML.querySelector(basketClassNames.indexClass);
			const titleHTML = templateHTML.querySelector(basketClassNames.titleClass);
			const priceHTML = templateHTML.querySelector(basketClassNames.priceClass);
			const buttonHTML = templateHTML.querySelector(
				basketClassNames.buttonClass
			);

			titleHTML.textContent = item.title;
			indexHTML.textContent = String(index + 1);
			buttonHTML.addEventListener('click', () => {
				this.deleteBasket(templateHTML, item, basketClassNames);
				this.inactive();
			});
			if (item.price !== null) {
				priceHTML.textContent = item.price + ' ' + 'синапсов';
			} else {
				priceHTML.textContent = 'Бесценно';
			}
			conteinerBasket.append(templateHTML);
		});
		const totalHTML = document.querySelector(basketClassNames.totalClass);
		totalHTML.textContent = this.sum();
	};

	headerInsertion(indexHeaderClass: string) {
		const indexHeaderHTML = document.querySelector(indexHeaderClass);
		indexHeaderHTML.textContent = String(this.items.length);
	}

	inactive = () => {
		const paymentButtonHTML = this.button;
		paymentButtonHTML.disabled = false;
		if (this.items.length == 0 || this.sum() == 'Бесценно') {
			paymentButtonHTML.disabled = true;
		}
	};
	constructor(button: HTMLButtonElement) {
		this.button = button;
	}

	itemsToId = () => {
		const idList: string[] = [];
		this.items.forEach((item) => {
			idList.push(item.id);
		});
		return idList;
	};
}
