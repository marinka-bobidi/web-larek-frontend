import { Product } from '../components/common/Card';

// Продукт страницы
export interface IProduct {
	id: string;
	image: string;
	title: string;
	category: TCardCategory;
	price: string;
	description?: string;
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
	template: HTMLTemplateElement;
	product: IProduct;
	setInformation(
		title: string,
		category: string,
		image: string,
		price: string
	): void;
}

// Модальные окна
export interface IModalWindow {
	title: string;
	container: HTMLElement;
	open(): void;
	close(): void;
}

// Карточка продукта в модальном окне
export interface IPreviewModal {
	product: Product;
	button: HTMLButtonElement;
	transform(product: Product): void;
	render(data: {
		titleClass: string;
		categoryClass: string;
		imageClass: string;
		priceClass: string;
		descriptionClass: string;
	}): void;
	add(items: Product[]): void;
}

// Интерфейс объекта данных
export interface IBasketClassNames {
	container: string;
	template: string;
	headerClass: string;
	titleClass: string;
	indexClass: string;
	priceClass: string;
	totalClass: string;
	buttonClass: string;
}

// Содержание корзины
export interface IBasket {
	items: Product[];
	total: string;
	button: HTMLButtonElement;
	basketSubmitClear(): void;
	deleteBasket(
		element: HTMLElement,
		item: Product,
		dataBasket: IBasketClassNames
	): void;
	clearBasket(): void;
	render(dataBasket: IBasketClassNames): void;
	headerInsertion(indexHeaderClass: string): void;
	inactive(): void;
	itemsToId(): string[];
}

// Модальное окно покупки
export interface IModalPurchase {
	payment: TPayment;
}

// Способы оплаты
export type TPayment = 'Онлайн' | 'При получении';

// API
export interface IApi {
	getProductList: () => Promise<object>;
	submitPurchase: (data: IInformation) => Promise<any>;
}

// Информация о покупке
export interface IInformation {
	itemsID: string[];
	totalPrice: string;
	payment: string;
	adress: string;
	email: string;
	phone: string;
}

// Ответ API
export interface IProductResponse {
	total: number;
	items: IProduct[];
}

// Интерфейс валидации инпутов
export interface IValidation {
	input: HTMLInputElement;
	span: string;
	name: string;
	message: string;
	errors: boolean;
	active(): void;
	inactive(): void;
	valid(): void;
}

// Интерфейс валидации форм
export interface IValidationForm {
	input: IValidation[];
	button: HTMLButtonElement;
	invalid: boolean;
	check(): void;
	clearFields(): void;
}
