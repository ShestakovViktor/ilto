import {useEditorContext} from "@feature/editor/context";
import styles from "./NotificationArea.module.scss";
import {For, JSX} from "solid-js";

export function NotificationArea(): JSX.Element {
    const editorContext = useEditorContext();

    return (
        <div class={styles.NotificationArea}>
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