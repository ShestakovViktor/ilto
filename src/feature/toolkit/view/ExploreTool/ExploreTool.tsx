import * as styles from "./ExploreTool.module.scss";
import {JSXElement} from "solid-js";
import {EntityNode} from "@feature/toolkit/view";

export function Explorer(): JSXElement {
    return (
        <div class="explorer" classList={{[styles.Explorer]: true}}>
            <EntityNode entityId={1}/>
        </div>
    );
}
