import { IBasket, IBasketAction, ISubmitPurchase } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { Product } from './Card';

export class Basket implements IBasket {
	items: Product[] = [];
	total: string;
	button: string;
	events: IBasketAction;
	submit: ISubmitPurchase;

	sum = () => {
		let total = 0;
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].price == null) {
				return 'Бесценно';
				break;
			}
			total += Number(this.items[i].price);
		}
		return String(total) + ' синапсов';
	};

	deleteBasket = (
		element: HTMLElement,
		item: Product,
		dataBasket: {
			container: string;
			template: string;
			headerClass: string;
			titleClass: string;
			indexClass: string;
			priceClass: string;
			totalClass: string;
			button: string;
		}
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

	render = (dataBasket: {
		container: string;
		template: string;
		headerClass: string;
		titleClass: string;
		indexClass: string;
		priceClass: string;
		totalClass: string;
		button: string;
	}) => {
		this.items.forEach((item, index) => {
			const conteinerBasket = document.querySelector(dataBasket.container);
			const templateHTML = cloneTemplate(dataBasket.template);
			const indexHTML = templateHTML.querySelector(dataBasket.indexClass);
			const titleHTML = templateHTML.querySelector(dataBasket.titleClass);
			const priceHTML = templateHTML.querySelector(dataBasket.priceClass);
			const buttonHTML = templateHTML.querySelector(dataBasket.button);
			titleHTML.textContent = item.title;
			indexHTML.textContent = String(index + 1);
			buttonHTML.addEventListener('click', () => {
				this.deleteBasket(templateHTML, item, dataBasket);
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
}
