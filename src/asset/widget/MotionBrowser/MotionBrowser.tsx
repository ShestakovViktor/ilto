import en from "./string/en.json";
import * as styles from "./MotionBrowser.module.scss";

import {JSX} from "solid-js";
import i18next from "i18next";
import {AssetBrowser} from "@src/asset/widget";
import {Modal, Dialog} from "@src/shared/view";
import {ASSET_TYPE} from "@src/asset/enum";
import {useSharedContext} from "@src/shared/context";
import {MotionForm} from "@src/asset/widget";

i18next.addResourceBundle("en", "motion", {"MotionBrowser": en}, true, true);

type Props = {
    selected?: number[];
    onSelect?: (ids: number[]) => void;
};

export function MotionBrowser(props: Props): JSX.Element {
    const {database} = useSharedContext();

    const [motionType] = database.data.assetType
        .filter({name: ASSET_TYPE.MOTION});

    if (!motionType) throw new Error();

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
            type={motionType.id}
            selected={props.selected}
            onCreate={() => {
                motionFormDialog.show();
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