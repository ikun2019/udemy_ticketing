import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
	reason = 'Error connecting to database';
	constructor() {
		super('Error connecting to database');
		Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
	}
	statusCode = 500;
	serializeErrors() {
		return [{ message: this.reason }];
	}
}
