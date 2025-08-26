import en from "./string/en.json";
import * as styles from "./PropBrowser.module.scss";

import {createMemo, For, JSX} from "solid-js";
import i18next from "i18next";
import {AssetBrowser} from "@src/asset/widget";
import {Modal, Dialog} from "@src/shared/view";
import {ASSET_TYPE} from "@src/asset/enum";
import {PropForm} from "@src/asset/widget/PropForm";
import {useSharedContext} from "@src/shared/context";
import {Asset} from "@src/asset/type";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    selected?: number[];
    onSelect: (ids: number[]) => void;
};

export function PropBrowser(props: Props): JSX.Element {
    const {database} = useSharedContext();

    const [propType] = database.data.assetType
        .filter({name: ASSET_TYPE.PROP});

    const assets = createMemo(() => database.data.asset
        .filter<Asset>({assetTypeId: propType.id})
    );

    if (!propType) throw new Error();

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