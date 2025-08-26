import * as styles from "./ToolBar.module.scss";
import FileIconSvg from "@res/svg/medium/file.svg";
import EditIconSvg from "@res/svg/medium/edit.svg";
import TreeIconSvg from "@res/svg/medium/tree.svg";

import {For, JSX} from "solid-js";
import {Button} from "@src/shared/view";
import {TOOLKIT_MODE} from "@src/editor/enum";
import {useEditorContext} from "@src/editor/context";

export function ToolBar(): JSX.Element {
    const editorContext = useEditorContext();

    const buttons = [
        {icon: FileIconSvg, mode: TOOLKIT_MODE.SYSTEM},
        {icon: TreeIconSvg, mode: TOOLKIT_MODE.EXPLORE},
        {icon: EditIconSvg, mode: TOOLKIT_MODE.EDIT},
    ];

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
                        pressed={editorContext.session.toolkit == button.mode}
                        icon={button.icon}
                        onClick={() => {
                            editorContext.setSession({
                                toolkit: button.mode,
                            });
                        }}
                    />
                }
            </For>
        </div>
    );
}

