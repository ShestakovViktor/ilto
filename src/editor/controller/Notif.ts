import {Getter, NotificationRecord, Session, Setter} from "@src/editor/type";
import {Uid} from "@src/editor/controller";

export class Notif {
	private delay = 0;

	private duration = 3000;

	constructor(
		private uid: Uid,
		private getSession: Getter<Session>,
		private setSession: Setter<Session>
	) {}

	private addNotification(
		notification: NotificationRecord
	): NotificationRecord {

		this.setSession((prev) => ({
			notification: prev.notification.push(notification),
		}));

		return this.getSession().notification.at(-1)!;
	}

	private delNotification(notifiaction: NotificationRecord): void {
		this.setSession((prev) => ({
			notification: prev.notification
				.filter(item => item.id != notifiaction.id),
		}));
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