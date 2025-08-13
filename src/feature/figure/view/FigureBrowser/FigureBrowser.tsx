import en from "./string/en.json";
import * as styles from "./FigureBrowser.module.scss";

import {JSX} from "solid-js";
import i18next from "i18next";
import {AssetBrowser} from "@feature/asset/view";
import {Modal, Dialog} from "@shared/view";
import {ASSET_TYPE} from "@feature/asset/enum";
import {useStoreContext} from "@feature/store/context";
import {FigureForm} from "@feature/figure/view";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    selected?: number[];
    onSelect?: (ids: number[]) => void;
};

export function FigureBrowser(props: Props): JSX.Element {
    const storeContext = useStoreContext();

    const FigureFormDialog = new Modal();
    FigureFormDialog.render(
        <Dialog
            class={styles.FigureFormDialog}
            onClose={() => FigureFormDialog.hide()}
        >
            <FigureForm onSubmit={() => FigureFormDialog.hide()}/>
        </Dialog>
    );

    return (
        <AssetBrowser
            type={ASSET_TYPE.FIGURE}
            selected={props.selected}
            onCreate={() => {
                FigureFormDialog.show();
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