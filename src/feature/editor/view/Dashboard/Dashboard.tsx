import * as styles from "./Dashboard.module.scss";
import {For, JSX, Match, Switch} from "solid-js";
import {useEditorContext} from "@feature/editor/context";
import {EntityForm} from "@feature/entity/view";
import {UI_MODE} from "@feature/editor/enum";

export function Dashboard(): JSX.Element {
    const {state} = useEditorContext();

    return (
        <div class={styles.Dashboard}>
            <For each={state.dashboard.items}>
                {(item) =>
                    <Switch >
                        <Match when={item == UI_MODE.ENTITY_FORM}>
                            <EntityForm/>
                        </Match>
                    </Switch>
                }
            </For>
        </div>
    );
}