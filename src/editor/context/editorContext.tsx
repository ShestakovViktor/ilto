import {JSX, createContext, createEffect, useContext} from "solid-js";
import {createStore} from "solid-js/store";
import {InputMode, ToolMode} from "@src/editor/enum";
import {EditorContext, Session} from "@src/editor/type";
import {useCoreContext} from "@src/core/context";
import {useViewerContext} from "@src/viewer/context";
import {
    Log,
    Mouse,
    Key,
    Engine,
    Notif,
    Modal,
    Uid,
} from "@src/editor/controller";
import {
    RedoHotkey,
    UndoHotkey,
    SaveHotkey,
} from "@src/editor/controller/hotkey";
import {Storage} from "@src/storage/controller";

type Props = {
    children: JSX.Element | JSX.Element[];
    storage: Storage;
};

export const editorContext = createContext<EditorContext | undefined>();

export function EditorProvider(props: Props): JSX.Element {
    const {storage} = props;
    const {linker, browser, archiver} = useCoreContext();
    const {viewer} = useViewerContext();

    const [session, setSession] = createStore<Session>({
        selected: undefined,
        layer: undefined,
        toolkit: ToolMode.System,
        inputMode: InputMode.DefaultView,
        notification: [],
    });

    const uid = new Uid();
    const notif = new Notif(uid, session, setSession);
    const modal = new Modal(uid);
    const log = new Log(uid);
    const engine = new Engine(log);
    const key = new Key([
        new RedoHotkey(engine),
        new UndoHotkey(engine),
        new SaveHotkey(storage, linker, archiver, browser),
    ]);
    const mouse = new Mouse(
        storage,
        viewer,
        session,
        setSession,
        engine,
        modal
    );

    createEffect(() => {
        mouse.setMode(session.inputMode);
    });

    const value = {
        session,
        setSession,

        storage,

        log,
        mouse,
        key,
        engine,
        notif,
        modal,
        uid,
    };

    return (
        <editorContext.Provider value={value}>
            {props.children}
        </editorContext.Provider>
    );
}

export function useEditorContext(): EditorContext {
    const context = useContext(editorContext);

    if (!context) {
        throw new Error("There is no editor context");
    }

    return context;
}

// let prev: Entity | undefined;
// let curr: Entity | undefined;

// createEffect(() => {
//     curr = editor.selected;

//     if (prev) {
//         const prevSelected = document
//             .querySelector(`[data-entity-id="${prev.id}"]`);
//         if (prevSelected) prevSelected.classList.remove("Selected");
//     }

//     if (curr) {
//         const currSelected = document
//             .querySelector(`[data-entity-id="${curr.id}"]`);

//         if (currSelected) currSelected.classList.add("Selected");
//     }

//     prev = curr;
// });