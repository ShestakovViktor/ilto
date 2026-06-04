import {SetStoreFunction} from "solid-js/store";
import {Session} from "@src/editor/type";
import {
    Engine,
    Key,
    Mouse,
    Notif,
    Log,
    Modal,
    Uid,
} from "@src/editor/controller";
import {Storage} from "@src/storage/controller";

export type EditorContext = {
    session: Session;
    setSession: SetStoreFunction<Session>;

    storage: Storage;

    log: Log;
    mouse: Mouse;
    key: Key;
    engine: Engine;
    notif: Notif;
    modal: Modal;
    uid: Uid;
};