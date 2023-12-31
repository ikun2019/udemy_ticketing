import express, { Request, Response } from 'express';
import { NotFoundError } from '@im-tickets/common';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	const ticket = await Ticket.findById(id);
	if (!ticket) {
		throw new NotFoundError();
	}
	res.send(ticket);
});

export { router as showTicketRouter };
