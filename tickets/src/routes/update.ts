import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
	validationRequest,
	NotFoundError,
	requireAuth,
	NotAuthorizedError,
} from '@im-tickets/common';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('price').isFloat({ gt: 0 }).withMessage('Priceは0以上である必要があります'),
	],
	validationRequest,
	async (req: Request, res: Response) => {
		const id = req.params.id;
		const ticket = await Ticket.findById(id);
		if (!ticket) {
			throw new NotFoundError();
		}
		if (ticket.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		const { title, price } = req.body;
		ticket.set({ title, price });
		await ticket.save();
		res.send(ticket);
	}
);

export { router as updateTicketRouter };
