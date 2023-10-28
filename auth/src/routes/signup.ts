import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError } from '@im-tickets/common';
import { validationRequest } from '@im-tickets/common';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Emailに誤りがあります'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Passwordは4文字上20文字以内で設定してください'),
	],
	validationRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		// 登録済みのユーザーがいないかチェック
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			// console.log('Emailはすでに使われています');
			// return res.send({});
			throw new BadRequestError('Bad Request');
		}
		// ユーザーの登録
		const user = User.build({ email, password });
		await user.save();
		// jwt
		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		);
		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
