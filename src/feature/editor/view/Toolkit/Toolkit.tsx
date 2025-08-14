import * as styles from "./Toolkit.module.scss";

import {JSX} from "solid-js";
import {SystemToolkit, InputToolkit, EditToolkit} from "@feature/editor/view";

export function Toolkit(): JSX.Element {
    return (
        <div class={styles.CommandKit}>
            <SystemToolkit/>
            <EditToolkit/>
            <InputToolkit/>
        </div>
    );
}