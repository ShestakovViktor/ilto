import styles from "./ToolKit.module.scss";
import {JSX} from "solid-js";
import {Toolbar} from "@shared/view";

export function ToolKit(): JSX.Element {
    return (
        <Toolbar
            class={styles.ToolKit}
            column
        >
        </Toolbar>
    );
}