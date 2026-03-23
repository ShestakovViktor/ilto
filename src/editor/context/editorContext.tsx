import {JSX, createContext, createEffect, on, useContext} from "solid-js";
import {createStore} from "solid-js/store";
import {InputMode, ToolMode} from "@src/editor/enum";
import {EditorContext, Session, Cache} from "@src/editor/type";
import {useUtilityContext} from "@src/utility/context";
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
    ImageCreate,
} from "@src/editor/controller/input";
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
    const {linker, browser, archiver} = useUtilityContext();
    const {viewer} = useViewerContext();

    const [session, setSession] = createStore<Session>({
        selected: undefined,
        layer: undefined,
        toolkit: ToolMode.System,
        inputMode: InputMode.EntitySelect,
        notification: [],
    });

    const data = localStorage.getItem("cache");

    const [cache, setCache] = createStore<Cache>(
        data ? JSON.parse(data) : {widget: {}}
    );

    createEffect(on(
        () => JSON.stringify(cache),
        (s) => localStorage.setItem("cache", s))
    );

    const logManager = new LogManager();

    const actionManager = new ActionManager(logManager);
    const notificationManager = new NotifManager(session, setSession);

    const hotkeyManager = new HotkeyManager([
        new RedoHotkey(actionManager),
        new UndoHotkey(actionManager),
        new SaveHotkey(storage, linker, archiver, browser),
    ]);

    const inputManager = new InputManager({
        [InputMode.DefaultView]: new DefaultView(),
        [InputMode.EntitySelect]: new EntitySelect(
            storage,
            viewer,
            setSession,
            actionManager
        ),
        [InputMode.ImageCreate]: new ImageCreate(
            viewer,
            session,
            setSession,
            actionManager,
            storage
        ),
        [InputMode.MarkerCreate]: new MarkerCreate(
            viewer,
            session,
            setSession,
            actionManager,
            storage
        ),
        [InputMode.DecorCreate]: new DecorCreate(
            viewer,
            session,
            setSession,
            actionManager,
            storage
        ),
        [InputMode.AreaCreate]: new AreaCreate(
            viewer,
            session,
            setSession,
            actionManager,
            storage
        ),
    });

    createEffect(() => {
        inputManager.setMode(session.inputMode);
    });

    const value = {
        session,
        setSession,

        cache,
        setCache,

        storage,

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