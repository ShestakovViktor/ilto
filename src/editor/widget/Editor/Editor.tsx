import {JSX} from "solid-js";
import * as styles from "./Editor.module.scss";
import {
    ModalLayer,
    StatusBar,
    ToolBar,
    UtilityBar,
    WorkSpace,
} from "@src/editor/widget";
import {Viewer} from "@src/viewer/widget";
import {ScopeProvidor} from "@src/editor/context";

export function Editor(): JSX.Element {
    return (
        <ScopeProvidor value="Editor">
            <div class={styles.Editor} tabIndex={0}>
                <ToolBar/>
                <UtilityBar/>
                <WorkSpace>
                    <Viewer/>
                </WorkSpace>
                <StatusBar/>
                <ModalLayer/>
                {/* <Notification/> */}
            </div>
        </ScopeProvidor>
    );
}