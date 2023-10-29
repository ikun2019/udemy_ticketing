import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

const createTicket = () => {
	return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
		title: 'ticket1',
		price: 20,
	});
};

it('ticketの一覧を取得', async () => {
	await createTicket();
	await createTicket();
	await createTicket();
	const response = await request(app).get('/api/tickets').send().expect(200);
	expect(response.body.length).toEqual(3);
});
