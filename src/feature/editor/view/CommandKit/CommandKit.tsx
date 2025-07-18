import * as styles from "./CommandKit.module.scss";

import {JSX} from "solid-js";
import {SystemToolkit, InputToolkit, EditToolkit} from "@feature/editor/view";

export function CommandKit(): JSX.Element {
    return (
        <div class={styles.CommandKit}>
            <SystemToolkit/>
            <EditToolkit/>
            <InputToolkit/>
        </div>
    );
}