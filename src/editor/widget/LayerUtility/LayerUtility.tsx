import * as styles from "./LayerUtility.module.scss";
import {For, JSXElement} from "solid-js";
import {Widget} from "@src/editor/widget/UtilityBar/widget";
import {useSharedContext} from "@src/shared/context";
import {ENTITY_TYPE} from "@src/entity/enum";
import {useEditorContext} from "@src/editor/context";
import {Layer} from "@src/entity/type";
import {Type} from "@src/shared/type";

export function LayerUtility(): JSXElement {
    const {database} = useSharedContext();
    const {session, setSession} = useEditorContext();

    const [layerType] = database.data.entityType
        .filter<Type>({name: ENTITY_TYPE.LAYER});

    const layers = database.data.entity
        .filter<Layer>({entityTypeId: layerType.id});

    return (
        <Widget uid="qvda" title="Layers">
            <div class={styles.Layers}>
                <For each={layers}>
                    {layer =>
                        <div
                            class={styles.Layer}
                            classList={{
                                [styles.Selected]: session.layer == layer,
                            }}
                            onClick={() => setSession({layer})}
                        >
                            Layer id:{layer.id}
                            {String(session.layer == layer)}
                        </div>
                    }
                </For>
            </div>
        </Widget>
    );
}
