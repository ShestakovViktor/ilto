import * as styles from "./UtilityBar.module.scss";
import {createMemo, For, JSX, Show} from "solid-js";
import {useEditorContext} from "@src/editor/context";
import {ToolMode} from "@src/editor/enum";
import {CreateUtility, EntityUtility, ExploreUtility} from "@src/editor/widget/utility";
import {
    DisplayUtility,
    InitUtility,
    LayerUtility,
    SystemUtility,
} from "@src/editor/widget/utility";
import {Dynamic} from "solid-js/web";

type Utility = {
    component: (props: {uid: string}) => JSX.Element;
    uid: string;
};

export function UtilityBar(): JSX.Element {
    const {session, uid} = useEditorContext();

    const kits = createMemo<{[key: string]: Utility[]}>(() => ({
        [ToolMode.System]: [{
            component: SystemUtility,
            uid: uid.reg("dqvs"),
        }],
        [ToolMode.Init]: [{
            component: InitUtility,
            uid: uid.reg("abdg"),
        }],
        [ToolMode.Explore]: [{
            component: ExploreUtility,
            uid: uid.reg("dawf"),
        }, {
            component: DisplayUtility,
            uid: uid.reg("badf"),
        }],
        [ToolMode.Create]: [{
            component: CreateUtility,
            uid: uid.reg("mvqe"),
        }, {
            component: LayerUtility,
            uid: uid.reg("dsba"),
        }, {
            component: EntityUtility,
            uid: uid.reg("pbdf"),
        }, {
            component: DisplayUtility,
            uid: uid.reg("asfa"),
        }],
    }));

    const kit = createMemo(() => kits()[session.toolkit]);

    return (
        <div class={styles.UtilityBar}>
            <Show when={kit()} keyed>
                <For each={kit()}>
                    {(utility) =>
                        <Dynamic
                            component={utility.component}
                            uid={utility.uid}
                        />
                    }
                </For>
            </Show>
        </div>
    );
}