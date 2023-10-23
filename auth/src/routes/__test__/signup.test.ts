import request from 'supertest';
import { app } from '../../app';

it('サインアップに成功すると201を返す', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
});

it('無効なemailで400を返す', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'tetet',
			password: 'password',
		})
		.expect(400);
});

it('無効なpawwsordで400を返す', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'pas',
		})
		.expect(400);
});

it('ブランクなら400を返す', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: '',
			password: '',
		})
		.expect(400);
});

it('同じemailだと201を返す', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(400);
});

it('サインアップに成功したらcookieをセットする', async () => {
	const response = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
	expect(response.get('Set-Cookie')).toBeDefined();
});
