import * as styles from "./ExploreUtility.module.scss";
import {JSXElement} from "solid-js";
import {Widget} from "@src/editor/widget/UtilityBar/widget";
// import {EntityNode} from "./widget";

type Props = {
    uid: string;
};

export function ExploreUtility(props: Props): JSXElement {
    return (
        <Widget uid={props.uid} title="Explore">
            <div class="explorer" classList={{[styles.Explorer]: true}}>
                {/* <EntityNode entityId={1}/> */}
            </div>
        </Widget>
    );
}
