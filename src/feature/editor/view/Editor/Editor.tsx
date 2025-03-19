import {IDS} from "@enum";
import {JSX, onMount} from "solid-js";
import styles from "./Editor.module.scss";
import {
    ModalLayer,
    WorkSpace,
    SidePanel,
    ToolKit,
    DockArea,
    CommandKit,
} from "@feature/editor/view";
import {InputManager, HotkeyManager} from "@feature/editor/controller";
import {Viewer} from "@feature/viewer/view";
import {useEditorContext} from "@feature/editor/context";
import {useStoreContext} from "@feature/store/context";
import {Parent} from "@feature/entity/type";

export function Editor(): JSX.Element {
    const storeContext = useStoreContext();
    const editorContext = useEditorContext();

    let viewerRef!: HTMLDivElement;
    let editorRef!: HTMLDivElement;

    onMount(() => {
        new InputManager(viewerRef);
        new HotkeyManager(editorRef);
        editorRef.focus();

        const parent = storeContext.store.entity.getById<Parent>(3);
        if (!parent) throw new Error();

        editorContext.setLayer(parent);
    });

    return (
        <div
            id={IDS.EDITOR}
            class={styles.Editor}
            ref={editorRef}
            tabIndex={0}
        >
            <WorkSpace>
                <Viewer ref={viewerRef}/>
                <ToolKit/>
            </WorkSpace>
            <SidePanel>
                <CommandKit/>
                <DockArea/>
            </SidePanel>
            <ModalLayer/>
        </div>
    );
}