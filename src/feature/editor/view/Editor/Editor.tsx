import {JSX, onMount} from "solid-js";
import * as styles from "./Editor.module.scss";
import {useEditorContext} from "@feature/editor/context";
import {useStoreContext} from "@feature/store/context";
import {Parent} from "@feature/entity/type";
import {
    ModalLayer,
    WorkSpace,
    SidePanel,
    ToolKit,
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
import {WebArchiveDriver, WebImageDriver} from "@feature/editor/controller/driver";
import {EditorContext} from "@feature/editor/type";

export function Editor(): JSX.Element {
    const storeContext = useStoreContext();
    const editorContext = useEditorContext();

    let viewerRef!: HTMLDivElement;
    let editorRef!: HTMLDivElement;

    onMount(() => {
        Object.assign<EditorContext, Partial<EditorContext>>(editorContext, {
            input: new InputManager(viewerRef),
            action: new ActionManager(),
            hotkey: new HotkeyManager(editorRef),
            notification: new NotificationManager(),
            log: new LogManager(),

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