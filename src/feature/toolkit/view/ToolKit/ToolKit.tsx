import * as styles from "./ToolKit.module.scss";
import FileIconSvg from "@res/svg/medium/file.svg";
import EditIconSvg from "@res/svg/medium/edit.svg";
import TreeIconSvg from "@res/svg/medium/tree.svg";

import {For, JSX} from "solid-js";
import {Button} from "@shared/view";
import {useEditorContext} from "@feature/editor/context";
import {TOOLKIT_MODE} from "@feature/editor/enum";

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
                            button: styles.Button,
                            icon: styles.Icon,
                            pressed: styles.Pressed,
                        }}
                        pressed={editorContext.state.toolkit == button.mode}
                        icon={button.icon}
                        onClick={() => {
                            editorContext.setState({
                                toolkit: button.mode,
                            });
                        }}
                    />
                }
            </For>
        </div>
    );
}

