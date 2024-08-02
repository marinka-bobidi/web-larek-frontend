import './scss/styles.scss';

// Главная страница
export interface IView {
	list: HTMLElement;
	basket: HTMLElement;
}

// Продукт страницы
export interface IProduct {
	id: string;
	imageUrl: string;
	category: TCardCategory; // Категории продукта страницы (см.19)
	title: string;
	description?: string; // на случай если нет описания товара
	price: number | null; // на случай если цена 'бесценно'
}

// Категории продукта страницы
export type TCardCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

// Карточка с продуктом страницы
export interface ICard {
	product: IProduct;
	events: ICardEvt; //см.33
}

// Описание события "клик по карточке"
export interface ICardEvt {
	onClick: (event: MouseEvent) => void;
}

// Карточка продукта в модальном окне
export interface ICardModal {
	product: ICard[];
	buttonCard: string;
	events: IBasketAction; //cм.45
}

// Контроль корзины "клик по кнопке в карточке"
export interface IBasketAction {
	add(product: string): void;
	remove(product: string): void;
}

// Каталог товаров на главной странице
export interface ICardList {
	catalog: ICard[];
	total: number;
}

// Содержание корзины
export interface IBasket {
	itemsId: string[];
	total: number | string;
	buttonBacket: string;
	events: IBasketAction; //см.45
	submit: ISubmitPurchase; //cм.66
}

// Действия оформить, далее, оплатить.
export interface ISubmitPurchase {
	submitBasket(): void;
	submitPaymentAdress(): void;
	submitPurchase(): void;
}

// Формы
export interface IForms {
	payment: TPayment; // Способы оплаты (см.82)
	address: string;
	email: string;
	phone: string;
}

// Способы оплаты
export type TPayment = 'онлайн' | 'при получении';

// Валидация форм
export interface IFormValidation {
	errors: string[];
	valid: boolean;
}

// Окно успешного оформления заказа
export interface IFormSuccess {
	successUrl: string;
	success: string;
	summary: number;
	buttonSuccess: string;
	event: IFormSuccessClose; //см.99
}

// Описание события успешного оформления заказа
export interface IFormSuccessClose {
	onClick: (event: MouseEvent) => void;
}

// API
export interface IApi {
	getProductList: () => Promise<IProduct[]>;
	submitPurchase: (form: IForms, products: string[]) => Promise<any>;
}
