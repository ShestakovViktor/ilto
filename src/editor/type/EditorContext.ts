import {SetStoreFunction} from "solid-js/store";
import {Session, Storage} from "@src/editor/type";
import {
    ActionManager,
    HotkeyManager,
    InputManager,
    NotifManager,
    LogManager,
} from "@src/editor/controller";

export type EditorContext = {
    session: Session;
    setSession: SetStoreFunction<Session>;

    storage: Storage;
    setStorage: SetStoreFunction<Storage>;

    log: LogManager;
    input: InputManager;
    action: ActionManager;
    hotkey: HotkeyManager;
    notif: NotifManager;
};