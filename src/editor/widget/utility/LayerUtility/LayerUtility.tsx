import * as styles from "./LayerUtility.module.scss";
import {createMemo, For, JSXElement, on} from "solid-js";
import {Widget} from "@src/editor/widget/UtilityBar/widget";
import {EntityKind} from "@src/core/enum";
import {useEditorContext} from "@src/editor/context";
import {Layer} from "@src/core/type";

type Props = {
    uid: string;
};

export function LayerUtility(props: Props): JSXElement {
    const {storage, session, setSession} = useEditorContext();

    const layers = createMemo(on(storage.reloaded, () =>
        storage.data.entity
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
