import {useEditorContext} from "@src/editor/context";
import * as styles from "./ModalLayer.module.scss";
import {For, JSX} from "solid-js";
import {Dynamic} from "solid-js/web";

export function ModalLayer(): JSX.Element {
    const {modal} = useEditorContext();

    return (
        <div class={styles.ModalLayer}>
            <For each={modal.getAll()}>
                {(modal) =>
                    <Dynamic
                        component={modal.component}
                        onClose={modal.onClose}
                    />
                }
            </For>
        </div>
    );
}