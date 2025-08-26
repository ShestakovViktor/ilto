import * as styles from "./ExploreUtility.module.scss";
import {JSXElement} from "solid-js";
import {Widget} from "@src/editor/widget/UtilityBar/widget";
import {EntityNode} from "./widget";

export function ExploreUtility(): JSXElement {
    return (
        <Widget uid="qvda" title="Explore">
            <div class="explorer" classList={{[styles.Explorer]: true}}>
                <EntityNode entityId={1}/>
            </div>
        </Widget>
    );
}
