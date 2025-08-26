import {Accessor, For, JSX} from "solid-js";
import * as styles from "./LayerView.module.scss";
import {EntityView} from "@src/entity/widget";
import {Layer} from "@src/entity/type";

type Props = {
    entity: Accessor<Layer>;
};

export function LayerView(props: Props): JSX.Element {
    const {entity} = props;

    return (
        <div
            class={styles.Layer}
            data-entity-id={entity().id}
        >
            <For each={entity().childIds}>
                {id => <EntityView entityId={id}/>}
            </For>
        </div>
    );
}