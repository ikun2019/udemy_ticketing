import request from 'supertest';
import { app } from '../../app';

it('カレントユーザーに対するレスポンス', async () => {
	const cookie = await global.signin();

	const response = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send({})
		.expect(200);
	console.log(response.body);
	expect(response.body.currentUser.email).toEqual('test@test.com');
});

// it('認証されてない場合nullを返す', async () => {
// 	const response = await request(app).get('/api/users/currentuser').send().expect(200);

// 	expect(response.body.currentUser).toEqual(null);
// });
