import en from "./string/en.json";
import * as styles from "./PropBrowser.module.scss";

import {createMemo, For, JSX} from "solid-js";
import i18next from "i18next";
import {Modal, Dialog} from "@src/utility/view";
import {AssetKind} from "@src/asset/enum";
import {PropForm} from "@src/asset/widget/PropForm";
import {Asset} from "@src/asset/type";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    selected?: number[];
    onSelect: (ids: number[]) => void;
};

export function PropBrowser(props: Props): JSX.Element {
    const {storage} = useEditorContext();

    const assets = createMemo(() => storage.data.asset
        .filter<Asset>({kind: AssetKind.Image})
    );

    const propFormDialog = new Modal();
    propFormDialog.render(
        <Dialog
            class={styles.PropFormDialog}
            onClose={() => propFormDialog.hide()}
        >
            <PropForm onSubmit={() => {
                propFormDialog.hide();
            }}/>
        </Dialog>
    );

    return (
        <div class={styles.Browser}>
            <div
                class={styles.Prop}
                onClick={() => {propFormDialog.show();}}>
                +
            </div>
            <For each={assets()}>
                {(asset) =>
                    <div
                        class={styles.Prop}
                        onClick={() => props.onSelect([asset.id])}
                    >
                        <img src={asset.path}/>
                    </div>
                }
            </For>
        </div>
    );
}