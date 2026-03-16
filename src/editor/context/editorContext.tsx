import {JSX, createContext, createEffect, on, useContext} from "solid-js";
import {createStore} from "solid-js/store";
import {InputMode, ToolkitMode} from "@src/editor/enum";
import {EditorContext, Session, Storage} from "@src/editor/type";
import {useSharedContext} from "@src/shared/context";
import {useViewerContext} from "@src/viewer/context";
import {
    LogManager,
    InputManager,
    HotkeyManager,
    ActionManager,
    NotifManager,
} from "@src/editor/controller";
import {
    AreaCreate,
    DecorCreate,
    DefaultView,
    EntitySelect,
    MarkerCreate,
} from "@src/editor/controller/input";
import {
    RedoHotkey,
    UndoHotkey,
    SaveHotkey,
} from "@src/editor/controller/hotkey";

type Props = {
    children: JSX.Element | JSX.Element[];
};

export const editorContext = createContext<EditorContext | undefined>();

export function EditorProvider(props: Props): JSX.Element {
    const {database, linker, browser, archiver} = useSharedContext();
    const {viewer} = useViewerContext();

    const [session, setSession] = createStore<Session>({
        selected: undefined,
        layer: undefined,
        toolkit: ToolkitMode.System,
        inputMode: InputMode.EntitySelect,
        notification: [],
    });

    const data = localStorage.getItem("storage");

    const [storage, setStorage] = createStore<Storage>(
        data ? JSON.parse(data) : {widget: {}}
    );

    createEffect(on(
        () => JSON.stringify(storage),
        (s) => localStorage.setItem("storage", s))
    );

    const logManager = new LogManager();

    const actionManager = new ActionManager(logManager);
    const notificationManager = new NotifManager(session, setSession);

    const hotkeyManager = new HotkeyManager([
        new RedoHotkey(actionManager),
        new UndoHotkey(actionManager),
        new SaveHotkey(database, linker, archiver, browser),
    ]);

    const inputManager = new InputManager({
        [InputMode.DefaultView]: new DefaultView(),
        [InputMode.EntitySelect]: new EntitySelect(
            database,
            viewer,
            setSession,
            actionManager
        ),
        [InputMode.MarkerCreate]: new MarkerCreate(
            viewer,
            session,
            setSession,
            actionManager,
            database
        ),
        [InputMode.DecorCreate]: new DecorCreate(
            viewer,
            session,
            setSession,
            actionManager,
            database
        ),
        [InputMode.AreaCreate]: new AreaCreate(
            viewer,
            session,
            setSession,
            actionManager,
            database
        ),
    });

    createEffect(() => {
        inputManager.setMode(session.inputMode);
    });

    const value = {
        session,
        setSession,

        storage,
        setStorage,

        log: logManager,
        input: inputManager,
        hotkey: hotkeyManager,
        action: actionManager,
        notif: notificationManager,
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