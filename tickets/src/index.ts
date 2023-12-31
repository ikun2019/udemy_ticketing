import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEYがありません');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URIがありません');
	}
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('Connected to MongoDB');
	} catch (error) {
		console.log(error);
	}
	app.listen(3000, () => {
		console.log('auth3000番が起動中!');
	});
};

start();
