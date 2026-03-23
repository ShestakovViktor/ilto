import en from "./string/en.json";
import * as styles from "./MotionBrowser.module.scss";

import {JSX} from "solid-js";
import i18next from "i18next";
import {AssetBrowser} from "@src/asset/widget";
import {Modal, Dialog} from "@src/utility/view";
import {AssetKind} from "@src/asset/enum";
import {MotionForm} from "@src/asset/widget";
import {useEditorContext} from "@src/editor/context";

i18next.addResourceBundle("en", "motion", {"MotionBrowser": en}, true, true);

type Props = {
    selected?: number[];
    onSelect?: (ids: number[]) => void;
};

export function MotionBrowser(props: Props): JSX.Element {
    const {storage} = useEditorContext();

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
            type={AssetKind.Keyframe}
            selected={props.selected}
            onCreate={() => {
                motionFormDialog.show();
            }}
            onDelete={(ids) => {
                ids.forEach((id) => {
                    storage.data.asset.delete(id);
                });
            }}
            onSelect={props.onSelect}
        />
    );
}