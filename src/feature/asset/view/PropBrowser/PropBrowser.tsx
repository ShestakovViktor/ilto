import en from "./string/en.json";
import * as styles from "./PropBrowser.module.scss";

import {JSX} from "solid-js";
import i18next from "i18next";
import {AssetBrowser} from "@feature/asset/view";
import {Modal, Dialog} from "@shared/view";
import {ASSET_TYPE} from "@feature/asset/enum";
import {PropForm} from "@feature/asset/view/PropForm";
import {useStoreContext} from "@feature/store/context";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    selected?: number[];
    onSelect?: (ids: number[]) => void;
};

export function PropBrowser(props: Props): JSX.Element {
    const storeContext = useStoreContext();

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
        <AssetBrowser
            type={ASSET_TYPE.PROP}
            selected={props.selected}
            onCreate={() => {
                propFormDialog.show();
            }}
            onDelete={(ids) => {
                ids.forEach((id) => {
                    storeContext.store.asset.delete(id);
                });
            }}
            onSelect={props.onSelect}
        />
    );
}