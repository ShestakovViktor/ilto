import {useEditorContext} from "@feature/editor/context";
import * as styles from "./Notification.module.scss";
import {For, JSX} from "solid-js";

export function Notification(): JSX.Element {
    const editorContext = useEditorContext();

    return (
        <div class={styles.Notification}>
            <div class={styles.NotificationList}>
                <For each={editorContext.state.notification}>
                    {(notif) =>
                        <div class={styles.Notification}>{notif.message}</div>
                    }
                </For>
            </div>
        </div>
    );
}