import * as styles from "./WorkSpace.module.scss";
import {JSX} from "solid-js";
import {useEditorContext} from "@src/editor/context";

type Props = {
    children: JSX.Element;
};

export function WorkSpace(props: Props): JSX.Element {
    const {mouse: input} = useEditorContext();
    // hotkey.setElement(workspace);

    return (
        <div
            class={styles.WorkSpace}
            tabIndex={0}
            ref={(element) => {
                input.setElement(element);
            }}
        >
            {props.children}
        </div>
    );
}
