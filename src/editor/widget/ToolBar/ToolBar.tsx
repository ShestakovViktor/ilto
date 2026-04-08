import * as styles from "./ToolBar.module.scss";
import FileIconSvg from "@res/svg/medium/file.svg";
import EditIconSvg from "@res/svg/medium/edit.svg";
import TreeIconSvg from "@res/svg/medium/tree.svg";

import {For, JSX} from "solid-js";
import {Button} from "@src/core/widget";
import {ToolMode} from "@src/editor/enum";
import {useEditorContext} from "@src/editor/context";

export function ToolBar(): JSX.Element {
    const {session, setSession} = useEditorContext();

    const buttons = [{
        icon: FileIconSvg,
        toolMode: ToolMode.System,
    }, {
        icon: TreeIconSvg,
        toolMode: ToolMode.Explore,
    }, {
        icon: EditIconSvg,
        toolMode: ToolMode.Create,
    }];

    return (
        <div class={styles.ToolKit}>
            <For each={buttons}>
                {(button) =>
                    <Button
                        classList={{
                            Button: styles.Button,
                            Icon: styles.Icon,
                            Pressed: styles.Pressed,
                        }}
                        pressed={session.toolkit == button.toolMode}
                        icon={button.icon}
                        onClick={() => {
                            setSession({
                                toolkit: button.toolMode,
                            });
                        }}
                    />
                }
            </For>
        </div>
    );
}

