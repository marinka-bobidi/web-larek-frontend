import { ICard, IProduct, TCardCategory } from '../../types';

export class Product implements IProduct {
	id: string;
	image: string;
	title: string;
	category: TCardCategory;
	price: string;
	description?: string;

	constructor(
		id: string,
		image: string,
		title: string,
		category: TCardCategory,
		price: string
	) {
		this.id = id;
		this.image = image;
		this.title = title;
		this.category = category;
		this.price = price;
	}
}

export class Card implements ICard {
	template: HTMLTemplateElement;
	product: IProduct;

	//Class
	titleClass: string;
	categoryClass: string;
	imageClass: string;
	priceClass: string;
	//Html
	titleHTML: HTMLElement;
	categoryHTML: HTMLElement;
	imageHTML: HTMLImageElement;
	priceHTML: HTMLElement;

	constructor(
		template: HTMLTemplateElement,
		titleClass: string,
		categoryClass: string,
		imageClass: string,
		priceClass: string
	) {
		this.template = template;

		//Class
		this.titleClass = titleClass;
		this.categoryClass = categoryClass;
		this.imageClass = imageClass;
		this.priceClass = priceClass;

		//Html
		this.titleHTML = template.querySelector(titleClass);
		this.categoryHTML = template.querySelector(categoryClass);
		this.imageHTML = template.querySelector(imageClass);
		this.priceHTML = template.querySelector(priceClass);
	}

	// Присвоение
	setInformation = (
		title: string,
		category: string,
		image: string,
		price: string
	) => {
		this.titleHTML.textContent = title;
		this.categoryHTML.textContent = category;
		this.imageHTML.src = image;
		this.priceHTML.textContent = price;
	};
}
