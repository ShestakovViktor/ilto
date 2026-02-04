import * as styles from "./UtilityBar.module.scss";
import {createMemo, JSX, Show} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {TOOLKIT_MODE} from "@src/editor/enum";
import {ExploreUtility} from "@src/editor/widget";
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
    utility: JSX.Element[];
};

export function UtilityBar(): JSX.Element {
    const {session} = useEditorContext();

    const kits: {[key: string]: Toolkit} = {
        [TOOLKIT_MODE.SYSTEM]: {
            namespace: "SystemToolkit",
            utility: [<SystemUtility uid="fvqw"/>],
        },
        [TOOLKIT_MODE.INIT]: {
            namespace: "InitToolkit",
            utility: [<InitUtility uid="lwnm"/>],
        },
        [TOOLKIT_MODE.EXPLORE]: {
            namespace: "ExploreToolkit",
            utility: [
                <ExploreUtility uid="bmds"/>,
                <EntityUtility uid="lbnr"/>,
                <DisplayUtility uid="modf"/>,
            ],
        },
        [TOOLKIT_MODE.EDIT]: {
            namespace: "EditUtilities",
            utility: [
                <CreateUtility uid="fwgb"/>,
                <LayerUtility uid="pbdv"/>,
                <EntityUtility uid="cvdf"/>,
                <DisplayUtility uid="basd"/>,
            ],
        },
    };

    const kit = createMemo(() => kits[session.toolkit]);

    return (
        <div class={styles.UtilityBar}>
            <Show when={kit()} keyed>
                {kit().utility}
            </Show>
        </div>
    );
}