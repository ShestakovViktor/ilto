import {Hotkey} from "@feature/editor/controller";

export class UndoHotkey extends Hotkey {
    protected code = "KeyZ";

    protected ctrlKey = true;

    handle(): void {
        this.editorContext.action.undo();
    }
}