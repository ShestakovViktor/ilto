import {SetStoreFunction} from "solid-js/store";
import {Session, Cache} from "@src/editor/type";
import {
    ActionManager,
    HotkeyManager,
    InputManager,
    NotifManager,
    LogManager,
} from "@src/editor/controller";
import {Storage} from "@src/storage/controller";

export type EditorContext = {
    session: Session;
    setSession: SetStoreFunction<Session>;

    cache: Cache;
    setCache: SetStoreFunction<Cache>;

    storage: Storage;

    log: LogManager;
    input: InputManager;
    action: ActionManager;
    hotkey: HotkeyManager;
    notif: NotifManager;
};