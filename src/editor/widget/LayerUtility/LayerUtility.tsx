import * as styles from "./LayerUtility.module.scss";
import {createMemo, For, JSXElement, on} from "solid-js";
import {Widget} from "@src/editor/widget/UtilityBar/widget";
import {useSharedContext} from "@src/shared/context";
import {EntityKind} from "@src/entity/enum";
import {useEditorContext} from "@src/editor/context";
import {Layer} from "@src/entity/type";

type Props = {
    uid: string;
};

export function LayerUtility(props: Props): JSXElement {
    const {database} = useSharedContext();
    const {session, setSession} = useEditorContext();

    const layers = createMemo(on(database.reloaded, () =>
        database.data.entity
            .filter<Layer>({kind: EntityKind.Layer})
    ));

    return (
        <Widget uid={props.uid} title="Layers">
            <div class={styles.Layers}>
                <For each={layers()}>
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
