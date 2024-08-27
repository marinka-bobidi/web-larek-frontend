import { IApi, IForms, IProductResponse, IProduct } from '../../types';
import { Api } from '../base/api';

export class API extends Api implements IApi {
	url: string;

	constructor(url: string) {
		super(url);
		this.url = url;
	}

	getProductList = () => {
		return this.get('/product');
	};

	submitPurchase: (form: IForms, products: string[]) => Promise<any>;
}

export class ProductResponse implements IProductResponse {
	total: number;
	items: IProduct[];

	//Class
	titleClass: string;
	categoryClass: string;
	imageClass: string;
	priceClass: string;
	discription: string;
	//Html
	titleHTML: HTMLElement;
	categoryHTML: HTMLElement;
	imageHTML: HTMLImageElement;
	priceHTML: HTMLElement;
}
