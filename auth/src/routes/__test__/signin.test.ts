import request from 'supertest';
import { app } from '../../app';

it('存在しないemailで失敗するケース', async () => {
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(400);
});

it('不正なパスワードでサインイン', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'pass',
		})
		.expect(400);
});

it('正しいログインでcookieが設定されているか', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
	const response = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(200);
	expect(response.get('Set-Cookie')).toBeDefined();
});
