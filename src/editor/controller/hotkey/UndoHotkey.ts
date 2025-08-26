import {ActionManager, Hotkey} from "@src/editor/controller";

export class UndoHotkey extends Hotkey {
    protected code = "KeyZ";

    protected ctrlKey = true;

    constructor(private actionManager: ActionManager) {
        super();
    }

    handle(): void {
        this.actionManager.undo();
    }
}