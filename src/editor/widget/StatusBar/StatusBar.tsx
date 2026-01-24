import {JSX} from "solid-js";
import * as styles from "./StatusBar.module.scss";
import {useEditorContext} from "@src/editor/context";
import {useViewerContext} from "@src/viewer/context";

export function StatusBar(): JSX.Element {
    const {session} = useEditorContext();
    const {viewer} = useViewerContext();

    return (
        <div class={styles.StatusBar}>
            <div>mode: {session.inputMode}</div>
            <div>scale: {viewer.scale}</div>
            <span></span>
            <div>selected: {session.selected?.id || ""}</div>
            <div>layer: {session.layer?.id || ""}</div>
        </div>
    );
}

