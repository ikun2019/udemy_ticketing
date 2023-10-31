import { Message, Stan } from 'node-nats-streaming';

// * Listener抽象クラス
export abstract class Listener {
	abstract subject: string; // abstractでサブクラスで具体的な実装を行う変数を宣言
	abstract queueGroupName: string; // abstractでサブクラスで具体的な実装を行う変数を宣言
	abstract onMessage(data: any, msg: Message): void; // abstractでサブクラスで具体的な実装を行う変数を宣言
	private client: Stan;
	protected ackWait = 5 * 1000;

	constructor(client: Stan) {
		this.client = client;
	}

	// subscribeのオプションを記述
	subscriptionOptions() {
		return this.client
			.subscriptionOptions()
			.setManualAckMode(true)
			.setDeliverAllAvailable()
			.setAckWait(this.ackWait)
			.setDurableName(this.queueGroupName);
	}

	// subscribeをlisten
	listen() {
		const subscription = this.client.subscribe(
			this.subject, // publisherで設定したdataのsubject
			this.queueGroupName, // listenerを複数起動しているときのキューブループ
			this.subscriptionOptions() // option
		);

		subscription.on('message', (msg: Message) => {
			console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
			const parseData = this.parseMessage(msg);
			this.onMessage(parseData, msg);
		});
	}

	parseMessage(msg: Message) {
		const data = msg.getData();
		return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
	}
}
