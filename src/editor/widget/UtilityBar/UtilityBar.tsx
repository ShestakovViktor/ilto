import * as styles from "./UtilityBar.module.scss";
import {createMemo, For, JSX, Show} from "solid-js";
import {ScopeProvidor, useEditorContext} from "@src/editor/context";
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
    scope: string;
};

export function UtilityBar(): JSX.Element {
    const {session, uid} = useEditorContext();

    const kits = createMemo<{[key: string]: Utility[]}>(() => ({
        [ToolMode.System]: [{
            component: SystemUtility,
            scope: uid.reg("dqvs"),
        }],
        [ToolMode.Init]: [{
            component: InitUtility,
            scope: uid.reg("abdg"),
        }],
        [ToolMode.Explore]: [{
            component: ExploreUtility,
            scope: uid.reg("dawf"),
        }, {
            component: DisplayUtility,
            scope: uid.reg("badf"),
        }],
        [ToolMode.Create]: [{
            component: CreateUtility,
            scope: uid.reg("mvqe"),
        }, {
            component: LayerUtility,
            scope: uid.reg("dsba"),
        }, {
            component: EntityUtility,
            scope: uid.reg("pbdf"),
        }, {
            component: DisplayUtility,
            scope: uid.reg("asfa"),
        }],
    }));

    const kit = createMemo(() => kits()[session.toolkit]);

    return (
        <ScopeProvidor value="UtilityBar">
            <div class={styles.UtilityBar}>
                <Show when={kit()} keyed>
                    <For each={kit()}>
                        {(utility) =>
                            <Dynamic
                                component={utility.component}
                                uid={utility.scope}
                            />
                        }
                    </For>
                </Show>
            </div>
        </ScopeProvidor>
    );
}