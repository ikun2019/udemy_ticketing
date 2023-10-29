import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('存在しないidのticketを更新しようとすると404', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'niufnduf',
			price: 20,
		})
		.expect(400);
});

it('ユーザーがログインしていないと401', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: 'niufnduf',
			price: 20,
		})
		.expect(401);
});

it('オーナーがログインユーザーでない場合401', async () => {
	const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title: 'niufnduf',
		price: 20,
	});
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({ title: 'nuidnuf', price: 45 })
		.expect(401);
});

it('ユーザーがtitleかpriceを入力しないと400', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'niufnduf',
		price: 20,
	});
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 20,
		})
		.expect(400);
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'fdfdf',
			price: -20,
		})
		.expect(400);
});

it('ticketをアップデートする', async () => {
	const cookie = global.signin();
	const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
		title: 'niufnduf',
		price: 20,
	});
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'new title',
			price: 100,
		})
		.expect(200);

	const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();

	expect(ticketResponse.body.title).toEqual('new title');
	expect(ticketResponse.body.price).toEqual(100);
});
