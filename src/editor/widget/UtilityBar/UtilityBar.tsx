import * as styles from "./UtilityBar.module.scss";
import {Component, createMemo, For, JSX, Show} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {TOOLKIT_MODE} from "@src/editor/enum";
import {ExploreUtility} from "@src/editor/widget";
import {Dynamic} from "solid-js/web";
import {
    CreateUtility,
    DisplayUtility,
    EntityUtility,
    InitUtility,
    LayerUtility,
    SystemUtility,
} from "@src/editor/widget";

type Toolkit = {
    namespace: string;
    utility: Component[];
};

export function UtilityBar(): JSX.Element {
    const {session} = useEditorContext();

    const kits: {[key: string]: Toolkit} = {
        [TOOLKIT_MODE.SYSTEM]: {
            namespace: "SystemToolkit",
            utility: [SystemUtility],
        },
        [TOOLKIT_MODE.INIT]: {
            namespace: "InitToolkit",
            utility: [InitUtility],
        },
        [TOOLKIT_MODE.EXPLORE]: {
            namespace: "ExploreToolkit",
            utility: [ExploreUtility, EntityUtility, DisplayUtility],
        },
        [TOOLKIT_MODE.EDIT]: {
            namespace: "EditUtilities",
            utility: [
                CreateUtility,
                LayerUtility,
                EntityUtility,
                DisplayUtility,
            ],
        },
    };

    const kit = createMemo(() => kits[session.toolkit]);

    return (
        <div class={styles.UtilityBar}>
            <Show when={kit()} keyed>
                <For each={kit().utility}>
                    {utility => <Dynamic component={utility}/>}
                </For>
            </Show>
        </div>
    );
}