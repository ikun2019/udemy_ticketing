import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('ticketが見つからなければ404を返す', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).send().expect(400);
});

it('ticketが見つかればticketを返す', async () => {
	const title = 'concert';
	const price = 20;

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title,
			price,
		})
		.expect(201);
	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);
	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
