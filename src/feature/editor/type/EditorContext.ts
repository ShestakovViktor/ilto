import {ArchiveDriver, ImageDriver} from "@interface";
import {SetStoreFunction} from "solid-js/store";
import {EditorState} from "@feature/editor/type";
import {
    ActionManager,
    HotkeyManager,
    InputManager,
    NotificationManager,
} from "@feature/editor/controller";

export type EditorContext = {
    state: EditorState;
    setState: SetStoreFunction<EditorState>;

    input: InputManager;
    action: ActionManager;
    hotkey: HotkeyManager;
    notification: NotificationManager;

    archiveDriver: ArchiveDriver;
    imageDriver: ImageDriver;
};