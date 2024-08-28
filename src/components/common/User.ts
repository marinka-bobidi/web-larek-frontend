import { IInformation } from '../../types';

export class Information implements IInformation {
	itemsID: string[];
	totalPrice: string;
	payment: string;
	adress: string;
	email: string;
	phone: string;
	constructor() {
		this.payment = 'При получении';
	}
}
