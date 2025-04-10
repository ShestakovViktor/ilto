import styles from "./EditToolkit.module.scss";
import en from "./string/en.json";
import DisketteIconSvg from "@res/svg/diskette.svg";
import ArrowLeftIconSvg from "@res/svg/arrow-left.svg";
import ArrowRightIconSvg from "@res/svg/arrow-right.svg";

import {Button, Toolbar} from "@shared/view";
import {JSX} from "solid-js";
import i18next from "i18next";

import {useStoreContext} from "@feature/store/context";
import {useEditorContext} from "@feature/editor/context";
import {saveData} from "@feature/editor/service/data";

i18next.addResourceBundle("en", "editor", {EditToolkit: en}, true, true);

export function EditToolkit(): JSX.Element {
    const storeContext = useStoreContext();
    const editorContext = useEditorContext();

    return (
        <Toolbar class={styles.SystemToolkit}>
            <Button
                class={styles.Button}
                icon={DisketteIconSvg}
                tooltip={i18next.t(
                    "editor:EditToolkit.save",
                    {postProcess: ["capitalize"]}
                )}
                onClick={() => {
                    void saveData(
                        storeContext.store,
                        editorContext.archiveDriver
                    );
                    editorContext.notification
                        .show({message: "Project saved"});
                }}
            />
            <Button
                class={styles.Button}
                icon={ArrowLeftIconSvg}
                tooltip={i18next.t(
                    "editor:EditToolkit.undo",
                    {postProcess: ["capitalize"]}
                )}
                onClick={() => editorContext.action.undo()}
            />
            <Button
                class={styles.Button}
                icon={ArrowRightIconSvg}
                tooltip={i18next.t(
                    "editor:EditToolkit.redo",
                    {postProcess: ["capitalize"]}
                )}
                onClick={() => editorContext.action.redo()}
            />
        </Toolbar>
    );
}