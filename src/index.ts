import './scss/styles.scss';

import {
	ModalPurchase,
	ModalWindow,
	PreviewModal,
} from './components/base/modals';
import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Basket } from './components/common/Basket';
import { Card, Product } from './components/common/Card';
import { API_URL, CDN_URL } from './utils/constants';
import { API, ProductResponse } from './components/common/API';
import { Validation, ValidationForm } from './components/common/Validation ';
import { Information } from './components/common/User';

//ProductAPI
const ProductAPI = new API(API_URL);
const cardList = document.querySelector('.gallery');
ProductAPI.getProductList()
	.then((res: ProductResponse) => {
		const products = res.items;
		products.forEach((product) => {
			const card = cloneTemplate(cardTemplate) as HTMLTemplateElement;
			const cardClone = new Card(
				card,
				'.card__title',
				'.card__category',
				'.card__image',
				'.card__price'
			);

			card.addEventListener('click', () => {
				emiterCard.emit('open_button', product);
			});

			let textPrice = String(product.price) + ' ' + 'синапсов';
			if (product.price == null) {
				textPrice = 'Бесценно';
			}

			cardList.append(card);
			cardClone.getInformation(
				product.title,
				product.category,
				CDN_URL + product.image,
				textPrice
			);
		});
	})
	.catch((err) => {
		console.error(err);
	});

//CardModal
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardWindow = document.querySelector('.card_full');
const cardModalHTML = cardWindow.closest('.modal') as HTMLElement;
const cardAddButton = cardModalHTML.querySelector(
	'.button'
) as HTMLButtonElement;
const cardModal = new PreviewModal(cardModalHTML, 'Card', cardAddButton);
const cardButtonClose = cardModalHTML.querySelector('.modal__close');

// data
const data = {
	titleClass: '.card__title',
	categoryClass: '.card__category',
	priceClass: '.card__price',
	imageClass: '.card__image',
	descriptionClass: '.card__text',
};

//EventEmitter
const emiterCard = new EventEmitter();
emiterCard.on('open_button', (product: Product) => {
	cardModal.transform(product);
	cardModal.open();
	cardModal.render(data);
	if (basket.items.includes(cardModal.product)) {
		cardAddButton.disabled = true;
		cardAddButton.textContent = 'В корзине';
	} else {
		cardAddButton.disabled = false;
		cardAddButton.textContent = 'В корзину';
	}
});

emiterCard.on('close_button', cardModal.close);
emiterCard.on('add_button', cardModal.add);
emiterCard.on('add_button', () => {
	basket.headerInsertion('.header__basket-counter');
});

cardButtonClose.addEventListener('click', () => {
	emiterCard.emit('close_button');
});

cardAddButton.addEventListener('click', () => {
	emiterCard.emit('add_button', basket.items);
	cardAddButton.disabled = true;
	cardAddButton.textContent = 'В корзине';
});

//BasketModal
const basketWindow = document.querySelector('.basket');
const basketModalHTML = basketWindow.closest('.modal') as HTMLElement;
const basketModal = new ModalWindow(basketModalHTML, 'Basket');
const basketPurchase = basketWindow.querySelector(
	'.button'
) as HTMLButtonElement;
const basket = new Basket(basketPurchase);
const basketButton = document.querySelector('.header__basket');
const basketButtonClose = basketModalHTML.querySelector('.modal__close');

const dataBasket = {
	container: '.basket__list',
	template: '#card-basket',
	headerClass: '.header__basket-counter',
	indexClass: '.basket__item-index',
	titleClass: '.card__title',
	priceClass: '.card__price',
	totalClass: '.basket__price',
	buttonClass: '.basket__item-delete',
};

// EventEmitter
const emiterBasket = new EventEmitter();
emiterBasket.on('open_button', () => {
	basketModal.open();
	basket.render(dataBasket);
	basket.inactive();
});

emiterBasket.on('close_button', basketModal.close);
emiterBasket.on('delete_button', basket.clearBasket);
basketButton.addEventListener('click', () => {
	emiterBasket.emit('open_button');
	emiterBasket.emit('delete_button');
	basket.render(dataBasket);
});

basketButtonClose.addEventListener('click', () => {
	emiterBasket.emit('close_button');
});

// PurchaseModal
const orderPaymentWindow = document.querySelector('.order__payment');
const modalPaymentHTML = orderPaymentWindow.closest('.modal') as HTMLElement;
const modalPayment = new ModalPurchase(modalPaymentHTML, 'Payment');
const paymentButtonClose = modalPaymentHTML.querySelector('.modal__close');
const paymentPurchase = modalPaymentHTML.querySelector(
	'.button__onwards'
) as HTMLButtonElement;

// PushInformation
const information = new Information();

// EventEmitter
const emiterPayment = new EventEmitter();
emiterPayment.on('purchase_button', modalPayment.open);
emiterPayment.on('close_button', modalPayment.close);

const orderButtons = modalPaymentHTML.querySelector('.order__buttons');
const orderButtonCard = orderButtons.querySelector('button[name="card"]');
const orderButtonCash = orderButtons.querySelector('button[name="cash"]');

orderButtonCard.addEventListener('click', () => {
	orderButtonCash.classList.remove('button_selected');
	orderButtonCard.classList.add('button_selected');
	modalPayment.payment = 'Онлайн';
});

orderButtonCash.addEventListener('click', () => {
	orderButtonCard.classList.remove('button_selected');
	orderButtonCash.classList.add('button_selected');
	modalPayment.payment = 'При получении';
});

basketPurchase.addEventListener('click', () => {
	emiterBasket.emit('close_button');
	emiterPayment.emit('purchase_button');
	const id_list = basket.items_to_id();
	information.itemsID = id_list;
	information.totalPrice = basket.total;
});

paymentButtonClose.addEventListener('click', () => {
	emiterPayment.emit('close_button');
});

// InfoModal
const orderInfoWindow = document.querySelector('.order__info');
const modalInfoHTML = orderInfoWindow.closest('.modal') as HTMLElement;
const modalInfo = new ModalWindow(modalInfoHTML, 'Info');
const infoButtonClose = modalInfoHTML.querySelector('.modal__close');
const infoPurchase = modalInfoHTML.querySelector(
	'.button'
) as HTMLButtonElement;

// EventEmitter
const emiterInfo = new EventEmitter();
emiterInfo.on('purchase_button', modalInfo.open);
emiterInfo.on('close_button', modalInfo.close);

paymentPurchase.addEventListener('click', (evt) => {
	evt.preventDefault();
	emiterPayment.emit('close_button');
	emiterInfo.emit('purchase_button');
	information.adress = adressInput.value;
	information.payment = modalPayment.payment;
});

infoButtonClose.addEventListener('click', () => {
	emiterInfo.emit('close_button');
});

// SuccessModal
const orderSuccessWindow = document.querySelector('.order-success');
const modalSuccessHTML = orderSuccessWindow.closest('.modal') as HTMLElement;
const modalSuccess = new ModalWindow(modalSuccessHTML, 'Info');
const successButtonClose = modalSuccessHTML.querySelector('.modal__close');
const successButton = modalSuccessHTML.querySelector('.button');
const successDescription = modalSuccessHTML.querySelector('.film__description');

// EventEmitter
const emiterSuccess = new EventEmitter();
emiterSuccess.on('purchase_button', modalSuccess.open);
emiterSuccess.on('close_button', modalSuccess.close);

infoPurchase.addEventListener('click', (evt) => {
	evt.preventDefault();
	emiterInfo.emit('close_button');
	information.email = emailInput.value;
	information.phone = phoneInput.value;
	ProductAPI.submitPurchase(information)
		.then((res: Promise<any>) => {
			emiterSuccess.emit('purchase_button');
			successDescription.textContent = 'Списано ' + basket.total + ' синапсов';
			basket.basketSubmitClear();
			basket.headerInsertion('.header__basket-counter');
			console.log(information);
		})
		.catch((res) => {
			console.log(res);
		});
});

successButtonClose.addEventListener('click', () => {
	emiterSuccess.emit('close_button');
});

successButton.addEventListener('click', () => {
	emiterSuccess.emit('close_button');
});

//Validation
const adressInput = modalPaymentHTML.querySelector(
	'.form__input'
) as HTMLInputElement;
const emailInput = modalInfoHTML.querySelector(
	'.email__input'
) as HTMLInputElement;
const phoneInput = modalInfoHTML.querySelector(
	'.phone__input'
) as HTMLInputElement;

const adressValidity = new Validation(
	adressInput,
	'Adress',
	'Введите адрес',
	'.adress__error-message'
);
const emailValidity = new Validation(
	emailInput,
	'Email',
	'Введите почту',
	'.email__error-message'
);
const phoneValidity = new Validation(
	phoneInput,
	'Phone',
	'Введите номер телефона',
	'.phone__error-message'
);

const paymentValidity = new ValidationForm([adressValidity], paymentPurchase);
const infoValidity = new ValidationForm(
	[emailValidity, phoneValidity],
	infoPurchase
);
const allCloseButtons = document.querySelectorAll('.modal__close');
allCloseButtons.forEach((button) => {
	button.addEventListener('click', () => {
		paymentValidity.clearFields();
		infoValidity.clearFields();
		adressValidity.valid();
		emailValidity.valid();
		phoneValidity.valid();
	});
});

emiterPayment.on('input_validity_payment', adressValidity.valid);
emiterInfo.on('input_validity_info', emailValidity.valid);
emiterInfo.on('input_validity_info', phoneValidity.valid);
emiterPayment.on('input_validity_payment', paymentValidity.check);
emiterInfo.on('input_validity_info', infoValidity.check);

adressInput.addEventListener('input', () => {
	emiterPayment.emit('input_validity_payment');
});

emailInput.addEventListener('input', () => {
	emiterInfo.emit('input_validity_info');
});

phoneInput.addEventListener('input', () => {
	emiterInfo.emit('input_validity_info');
});
