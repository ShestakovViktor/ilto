import {JSX, onMount} from "solid-js";
import * as styles from "./Editor.module.scss";
import {useEditorContext} from "@feature/editor/context";
import {useStoreContext} from "@feature/store/context";
import {Parent} from "@feature/entity/type";
import {EditorContext} from "@feature/editor/type";
import {Viewer} from "@feature/viewer/view";
import {Explorer} from "@feature/explorer/view/Explorer";
import {
    DockArea,
    CommandKit,
    NotificationArea,
} from "@feature/editor/view";
import {
    ActionManager,
    HotkeyManager,
    InputManager,
    NotificationManager,
    LogManager,
} from "@feature/editor/controller";
import {
    WebArchiveDriver,
    WebImageDriver,
} from "@feature/editor/controller/driver";

export function Editor(): JSX.Element {
    const storeContext = useStoreContext();
    const editorContext = useEditorContext();

    let viewerRef!: HTMLDivElement;
    let editorRef!: HTMLDivElement;

    onMount(() => {
        const logManager = new LogManager();

        Object.assign<EditorContext, Partial<EditorContext>>(editorContext, {
            log: logManager,
            input: new InputManager(viewerRef),
            action: new ActionManager(logManager),
            hotkey: new HotkeyManager(editorRef),
            notification: new NotificationManager(),

            archiveDriver: new WebArchiveDriver(),
            imageDriver: new WebImageDriver(),
        });

        editorRef.focus();

        const parent = storeContext.store.entity.select<Parent>(3);
        if (!parent) throw new Error();

        editorContext.setState({layer: parent});
    });

    return (
        <div
            class={styles.Editor}
            ref={editorRef}
            tabIndex={0}
        >
            <Viewer ref={viewerRef}/>
            <Explorer/>
            <NotificationArea/>
            <CommandKit/>
            <DockArea/>
            {/* <ModalLayer/> */}
            {/* <ToolKit/> */}
        </div>
    );
}