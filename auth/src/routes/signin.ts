import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationRequest } from '../middlewares/validate-request';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Emailが間違っています'),
		body('password').trim().notEmpty().withMessage('Passwordが空です'),
	],
	validationRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError('ログインに失敗しました');
		}
		const isMatch = await bcrypt.compare(password, existingUser.password);
		console.log('isMatch', isMatch);
		if (!isMatch) {
			throw new BadRequestError('ログイン情報が誤っています');
		}
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);
		req.session = {
			jwt: userJwt,
		};
		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
