import en from "./string/en.json";
import * as styles from "./MotionBrowser.module.scss";

import {JSX} from "solid-js";
import i18next from "i18next";
import {AssetBrowser} from "@feature/asset/view";
import {Modal, Dialog} from "@shared/view";
import {ASSET_TYPE} from "@feature/asset/enum";
import {useStoreContext} from "@feature/store/context";
import {MotionForm} from "@feature/motion/view";

i18next.addResourceBundle("en", "motion", {"MotionBrowser": en}, true, true);

type Props = {
    selected?: number[];
    onSelect?: (ids: number[]) => void;
};

export function MotionBrowser(props: Props): JSX.Element {
    const storeContext = useStoreContext();

    const motionFormDialog = new Modal();
    motionFormDialog.render(
        <Dialog
            class={styles.MotionFormDialog}
            onClose={() => motionFormDialog.hide()}
        >
            <MotionForm onSubmit={() => {
                motionFormDialog.hide();
            }}/>
        </Dialog>
    );

    return (
        <AssetBrowser
            type={ASSET_TYPE.MOTION}
            selected={props.selected}
            onCreate={() => {
                motionFormDialog.show();
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