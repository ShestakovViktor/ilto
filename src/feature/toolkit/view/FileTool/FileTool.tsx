import * as styles from "./FileTool.module.scss";
import i18next from "i18next";

import {JSX} from "solid-js";
import {Dialog, Modal} from "@shared/view";
import en from "./string/en.json";
import {useStoreContext} from "@feature/store/context";
import {useEditorContext} from "@feature/editor/context";
import {saveData, archiveData, compileData} from "@feature/editor/service/data";

import {ProjectSettings} from "@feature/editor/view";
import {downloadFile} from "@feature/editor/service/browser";
import {Accordion, Section} from "@feature/toolkit/view";

i18next.addResourceBundle("en", "editor", {SystemKit: en}, true, true);

export function ExportTool(): JSX.Element {
    const storeContext = useStoreContext();
    const editorContext = useEditorContext();
    const {archiveDriver: archiveDriver} = useEditorContext();

    const projectSettingsDialog = new Modal();
    projectSettingsDialog.render(
        <Dialog
            class={styles.ProjectSettingsDialog}
            onClose={() => projectSettingsDialog.hide()}
            title={i18next.t(
                "editor:SystemKit.projectSettings",
                {postProcess: ["capitalize"]}
            )}
        >
            <ProjectSettings/>
        </Dialog>
    );

    function handleSave(): void {
        void saveData(storeContext.store, editorContext.archiveDriver);
        editorContext.notification.show({message: "Project saved"});
    }

    async function handleExport(): Promise<void> {
        const data = storeContext.store.extract();
        const archive = await archiveData(archiveDriver, data);
        downloadFile(archive, "test.ilto");
    }

    async function handleCompile(): Promise<void> {
        const data = storeContext.store.extract();
        const archive = await compileData(archiveDriver, data);
        downloadFile(archive, "test.ilto");
    }

    return (
        <Accordion>
            <Section title="Project">
                <div onClick={handleSave}>Save</div>
                <div onClick={handleExport}>Expor</div>
                <div onClick={handleCompile}>Compile</div>
            </Section>
        </Accordion>
    );
}

