import { IApi, IProductResponse, IProduct } from '../../types';

import { Api } from '../base/api';
import { Information } from './User';

export class API extends Api implements IApi {
	url: string;

	constructor(url: string) {
		super(url);
		this.url = url;
	}

	getProductList = () => {
		return this.get('/product');
	};

	submitPurchase = (data: Information) => {
		let englishPayment = String();
		if (data.payment == 'Онлайн') {
			englishPayment = 'online';
		} else {
			englishPayment = 'cash';
		}
		const data_api = {
			payment: englishPayment,
			email: data.email,
			phone: data.phone,
			address: data.adress,
			total: Number(data.totalPrice),
			items: data.itemsID,
		};
		return this.post('/order', data_api);
	};
}

export class ProductResponse implements IProductResponse {
	total: number;
	items: IProduct[];
}
