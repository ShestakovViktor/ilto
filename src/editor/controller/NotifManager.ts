import {Session, NotificationRecord} from "@src/editor/type";
import {uuid} from "@src/utility/service/uuid";
import {SetStoreFunction} from "solid-js/store";

export class NotifManager {
    private delay = 0;

    private duration = 3000;

    constructor(
        private editor: Session,
        private setEditor: SetStoreFunction<Session>
    ) {}

    private addNotification(
        notification: NotificationRecord
    ): NotificationRecord {
        this.setEditor({
            notification: this.editor.notification
                .concat(notification),
        });

        return this.editor.notification.at(-1)!;
    }

    private delNotification(notifiaction: NotificationRecord): void {
        this.setEditor({
            notification: this.editor.notification
                .filter(item => item.id != notifiaction.id),
        });
    }

    show(props: {message: string; duration?: number; delay?: number}): void {
        const notifiaction = {
            id: uuid(),
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