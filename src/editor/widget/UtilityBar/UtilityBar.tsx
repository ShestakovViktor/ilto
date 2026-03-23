import * as styles from "./UtilityBar.module.scss";
import {createMemo, JSX, Show} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {InputMode, ToolMode} from "@src/editor/enum";
import {ExploreUtility} from "@src/editor/widget";
import {
    CreateUtility,
    DisplayUtility,
    EntityUtility,
    InitUtility,
    LayerUtility,
    SystemUtility,
} from "@src/editor/widget";

type UtilityKit = {
    toolMode: ToolMode;
    inputMode: InputMode;
    utility: JSX.Element[];
};

export function UtilityBar(): JSX.Element {
    const {session} = useEditorContext();

    const kits: UtilityKit[] = [
        {
            toolMode: ToolMode.System,
            inputMode: InputMode.DefaultView,
            utility: [<SystemUtility uid="fvqw"/>],
        },
        {
            toolMode: ToolMode.Init,
            inputMode: InputMode.DefaultView,
            utility: [<InitUtility uid="lwnm"/>],
        },
        {
            toolMode: ToolMode.Explore,
            inputMode: InputMode.DefaultView,
            utility: [
                <ExploreUtility uid="bmds"/>,
                <EntityUtility uid="lbnr"/>,
                <DisplayUtility uid="modf"/>,
            ],
        },
        {
            toolMode: ToolMode.Create,
            inputMode: InputMode.DefaultView,
            utility: [
                <CreateUtility uid="fwgb"/>,
            ],
        },
        {
            toolMode: ToolMode.Create,
            inputMode: InputMode.MarkerCreate,
            utility: [
                <CreateUtility uid="fggb"/>,
                <LayerUtility uid="pbdv"/>,
                <EntityUtility uid="cvdf"/>,
                <DisplayUtility uid="basd"/>,
            ],
        },
    ];

    const kit = createMemo(() =>
        kits.find(kit =>
            kit.toolMode == session.toolkit
            && kit.inputMode == session.inputMode
        )
    );

    return (
        <div class={styles.UtilityBar}>
            <Show when={kit()} keyed>
                {(kit) => kit.utility}
            </Show>
        </div>
    );
}