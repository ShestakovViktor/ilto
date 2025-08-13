import {EditorContext, NotificationRecord} from "@feature/editor/type";
import {useEditorContext} from "@feature/editor/context";
import {uuid} from "@shared/uuid";

export class NotificationManager {
    private delay = 0;

    private duration = 3000;

    private editorContext: EditorContext;

    constructor() {
        this.editorContext = useEditorContext();
    }

    private addNotification(
        notification: NotificationRecord
    ): NotificationRecord {
        this.editorContext.setState({
            notification: this.editorContext.state.notification
                .concat(notification),
        });

        return this.editorContext.state.notification.at(-1)!;
    }

    private delNotification(notifiaction: NotificationRecord): void {
        this.editorContext.setState({
            notification: this.editorContext.state.notification
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