import './scss/styles.scss';

import {
	ModalWindow,
	PreviewModal,
	ModalPurchase,
} from './components/base/modals';
import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Basket } from './components/common/Basket';
import { Card, Product } from './components/common/Card';
import { API_URL, CDN_URL } from './utils/constants';
import { API, ProductResponse } from './components/common/API';

//Шаблоны
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');

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
const basketList = basketWindow.querySelector('.basket__list') as HTMLElement;
const basketPurchase = basketWindow.querySelector(
	'.button'
) as HTMLButtonElement;

const basket = new Basket();

//BasketButton
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
	button: '.basket__item-delete',
};

// EventEmitter
const emiterBasket = new EventEmitter();
emiterBasket.on('open_button', () => {
	basketModal.open();
	basket.render(dataBasket);
});

emiterBasket.on('close_button', basketModal.close);
emiterBasket.on('delete_button', basket.clearBasket);

basketButton.addEventListener('click', () => {
	emiterBasket.emit('open_button');
	const basketDeleteButtons = basketList.querySelectorAll(
		'.basket__item-delete'
	);
	emiterBasket.emit('delete_button');
	basket.render(dataBasket);
	basketDeleteButtons.forEach((button) => {
		button.addEventListener('click', () => {
			emiterBasket.emit('delete_button');
			basket.render(dataBasket);
		});
	});
});

basketButtonClose.addEventListener('click', () => {
	emiterBasket.emit('close_button');
});

// PurchaseModal
const orderPaymentWindow = document.querySelector('.order__payment');
const modalPaymentHTML = orderPaymentWindow.closest('.modal') as HTMLElement;
const modalPayment = new ModalWindow(modalPaymentHTML, 'Payment');
const paymentButtonClose = modalPaymentHTML.querySelector('.modal__close');
const paymentPurchase = modalPaymentHTML.querySelector('.button__onwards');

// EventEmitter
const emiterPayment = new EventEmitter();
emiterPayment.on('purchase_button', modalPayment.open);
emiterPayment.on('close_button', modalPayment.close);

basketPurchase.addEventListener('click', () => {
	emiterBasket.emit('close_button');
	emiterPayment.emit('purchase_button');
});

paymentButtonClose.addEventListener('click', () => {
	emiterPayment.emit('close_button');
});

// InfoModal
const orderInfoWindow = document.querySelector('.order__info');
const modalInfoHTML = orderInfoWindow.closest('.modal') as HTMLElement;
const modalInfo = new ModalWindow(modalInfoHTML, 'Info');
const infoButtonClose = modalInfoHTML.querySelector('.modal__close');
const infoPurchase = modalInfoHTML.querySelector('.button');

// EventEmitter
const emiterInfo = new EventEmitter();
emiterInfo.on('purchase_button', modalInfo.open);
emiterInfo.on('close_button', modalInfo.close);

paymentPurchase.addEventListener('click', (evt) => {
	evt.preventDefault();
	emiterPayment.emit('close_button');
	emiterInfo.emit('purchase_button');
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

// EventEmitter
const emiterSuccess = new EventEmitter();
emiterSuccess.on('purchase_button', modalSuccess.open);
emiterSuccess.on('close_button', modalSuccess.close);

infoPurchase.addEventListener('click', (evt) => {
	evt.preventDefault();
	emiterInfo.emit('close_button');
	emiterSuccess.emit('purchase_button');
});

successButtonClose.addEventListener('click', () => {
	emiterSuccess.emit('close_button');
});

successButton.addEventListener('click', () => {
	emiterSuccess.emit('close_button');
});
