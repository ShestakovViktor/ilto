import type {NotificationRecord, Session} from "@src/editor/type";
import type {UidGenerator} from "@src/editor/controller";

export class ToastQueue {
	private delay = 0;

	private duration = 3000;

	constructor(
		private uid: UidGenerator,
		private session: Session
	) {}

	private addNotification(
		notification: NotificationRecord
	): NotificationRecord {

		this.session.notification.push(notification);

		return this.session.notification.at(-1)!;
	}

	private delNotification(notifiaction: NotificationRecord): void {
		this.session.notification = this.session.notification
			.filter(item => item.id != notifiaction.id);
	}

	show(props: {message: string; duration?: number; delay?: number}): void {
		const notifiaction = {
			id: this.uid.get(),
			timestamp: Date.now(),
			message: props.message,
			delay: props.delay || this.delay,
			duration: props.duration || this.duration,
		};

		setTimeout(() => {
			this.addNotification(notifiaction);

			setTimeout(() => {
				this.delNotification(notifiaction);
			}, notifiaction.delay + notifiaction.duration);
		}, notifiaction.delay);
	}
}