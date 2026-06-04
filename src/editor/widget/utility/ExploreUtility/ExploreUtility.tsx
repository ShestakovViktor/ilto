import * as styles from "./ExploreUtility.module.scss";
import {JSXElement} from "solid-js";
import {Widget} from "@src/editor/widget/UtilityBar/widget";
import {ScopeProvidor} from "@src/editor/context";
// import {EntityNode} from "./widget";

export function ExploreUtility(): JSXElement {
    return (
        <ScopeProvidor value="ExploreUtility">
            <Widget title="Explore">
                <div class="explorer" classList={{[styles.Explorer]: true}}>
                    {/* <EntityNode entityId={1}/> */}
                </div>
            </Widget>
        </ScopeProvidor>
    );
}
