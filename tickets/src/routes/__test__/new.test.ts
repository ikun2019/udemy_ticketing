import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

it('routeハンドラーが/api/ticketsに出ているか', async () => {
	const response = await request(app).post('/api/tickets').send({});
	expect(response.status).not.toEqual(404);
});

it('ユーザーがサインインしてる時だけアクセスできているか', async () => {
	const response = await request(app).post('/api/tickets').send({}).expect(401);
});

it('ユーザーがサインインしている場合に、401以外のステイタスコードを返す', async () => {
	const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});
	expect(response.status).not.toEqual(401);
});

it('titleがエラーの時にreturnしているか', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: '',
			price: 10,
		})
		.expect(400);
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			price: 10,
		})
		.expect(400);
});

it('priceがエラーの時にreturnしているか', async () => {
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'jifdjif',
			price: -10,
		})
		.expect(400);
	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({
			title: 'hufndu',
		})
		.expect(400);
});

it('有効な入力でチケットを作成している', async () => {
	let tickets = await Ticket.find({});
	expect(tickets.length).toEqual(0);

	const title = 'nufnudnu';

	await request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title,
		price: 20,
	});

	tickets = await Ticket.find({});
	expect(tickets.length).toEqual(1);
	expect(tickets[0].price).toEqual(20);
	expect(tickets[0].title).toEqual(title);
});
