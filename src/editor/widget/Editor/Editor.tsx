import {JSX} from "solid-js";
import * as styles from "./Editor.module.scss";
import {ModalLayer, ToolBar, UtilityBar, WorkSpace} from "@src/editor/widget";
import {Viewer} from "@src/viewer/widget";

export function Editor(): JSX.Element {
    return (
        <div class={styles.Editor} tabIndex={0}>
            <ToolBar/>
            <UtilityBar/>
            <WorkSpace>
                <Viewer/>
            </WorkSpace>
            <ModalLayer/>
            {/* <Notification/> */}
        </div>
    );
}