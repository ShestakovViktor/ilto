import i18next from "i18next";

import {JSX} from "solid-js";
import en from "./string/en.json";
import {downloadData, saveData} from "@src/editor/service";

import {
    ListItem,
    List,
    Section,
    Widget,
} from "@src/editor/widget/UtilityBar/widget";
import {restoreData} from "@src/editor/service";
import {useEditorContext} from "@src/editor/context";
import {ToolMode} from "@src/editor/enum";
import {loadDemo} from "@src/editor/service/loadDemo";
import {useUtilityContext} from "@src/utility/context";

i18next.addResourceBundle("en", "editor", {SystemKit: en}, true, true);

type Props = {
    uid: string;
};

export function SystemUtility(props: Props): JSX.Element {
    const {archiver, browser, linker} = useUtilityContext();
    const {storage, setSession} = useEditorContext();
    // const {notification} = useEditorContext();

    // async function handleProjectUpload(): Promise<void> {
    //     const file = await uploadFile({type: "file", accept: ".ilto"});
    //     const data = await importData(file, startupContext.archiveDriver);
    //     setData(data);
    // }

    // async function handleExport(): Promise<void> {
    //     const data = storage.extract();
    //     const archive = await archiveData(archiver, data);
    //     browser.downloadFile(archive, "test.ilto");
    // }

    // async function handleCompile(): Promise<void> {
    //     const data = storage.extract();
    //     const archive = await compileData(archiver, data);
    //     browser.downloadFile(archive, "test.ilto");
    // }

    function handleInit(): void {
        setSession({toolkit: ToolMode.Init});
    }

    function handleSave(): void {
        saveData(storage, linker, archiver, browser);
    }

    function handleRestore(): void {
        restoreData(storage, linker, archiver, browser);
    }

    function handleLoadDemo(): void {
        loadDemo(storage, linker, archiver, browser);
    }

    function handleDownload(): void {
        downloadData(storage, linker, archiver, browser);
    }

    return (
        <Widget uid={props.uid} title="System">
            <Section uid="mwef" title="Create">
                <List>
                    <ListItem onClick={handleInit}>
                        New project
                    </ListItem>
                </List>
            </Section>
            <Section uid={"vadj"} title="Save">
                <List>
                    <ListItem onClick={handleSave}>
                        Save
                    </ListItem>
                </List>
            </Section>
            <Section uid={"sdba"} title="Load">
                <List>
                    <ListItem onClick={handleRestore}>
                        Load from memory
                    </ListItem>
                    <ListItem onClick={handleLoadDemo}>
                        Load demo project
                    </ListItem>
                </List>
            </Section>
            <Section uid={"qvca"} title="Export">
                <List>
                    <ListItem onClick={handleDownload}>
                        Download
                    </ListItem>
                </List>
            </Section>
        </Widget>
    );
}