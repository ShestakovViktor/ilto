import en from "./string/en.json";
import * as styles from "./FigureBrowser.module.scss";

import {JSX} from "solid-js";
import i18next from "i18next";
import {AssetBrowser} from "@src/asset/widget";
import {Modal, Dialog} from "@src/shared/view";
import {AssetKind} from "@src/asset/enum";
import {useSharedContext} from "@src/shared/context";
import {FigureForm} from "@src/asset/widget";

i18next.addResourceBundle("en", "prop", {"PropSelect": en}, true, true);

type Props = {
    selected?: number[];
    onSelect?: (ids: number[]) => void;
};

export function FigureBrowser(props: Props): JSX.Element {
    const {database} = useSharedContext();

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
            type={AssetKind.Image}
            selected={props.selected}
            onCreate={() => {
                FigureFormDialog.show();
            }}
            onDelete={(ids) => {
                ids.forEach((id) => {
                    database.data.asset.delete(id);
                });
            }}
            onSelect={props.onSelect}
        />
    );
}