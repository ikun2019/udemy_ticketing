import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222',
});

stan.on('connect', () => {
	console.log('Listener connected to NATS');

	// natsにcloseすることを伝える
	stan.on('close', () => {
		console.log('Nats connection closed');
		process.exit();
	});

	new TicketCreatedListener(stan).listen();
});

// 割り込み要求があればclose
process.on('SIGINT', () => stan.close());
// 終了要求があればclose
process.on('SIGTERM', () => stan.close());
