import * as styles from "./UtilityBar.module.scss";
import {createMemo, JSX, Show} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {ToolkitMode} from "@src/editor/enum";
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
        [ToolkitMode.System]: {
            namespace: "SystemToolkit",
            utility: [<SystemUtility uid="fvqw"/>],
        },
        [ToolkitMode.Init]: {
            namespace: "InitToolkit",
            utility: [<InitUtility uid="lwnm"/>],
        },
        [ToolkitMode.Explore]: {
            namespace: "ExploreToolkit",
            utility: [
                <ExploreUtility uid="bmds"/>,
                <EntityUtility uid="lbnr"/>,
                <DisplayUtility uid="modf"/>,
            ],
        },
        [ToolkitMode.Edit]: {
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