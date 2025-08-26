import {ActionManager, Hotkey} from "@src/editor/controller";

export class RedoHotkey extends Hotkey {
    protected code = "KeyZ";

    protected ctrlKey = true;

    protected shiftKey = true;

    constructor(private actionManager: ActionManager) {
        super();
    }

    handle(): void {
        this.actionManager.redo();
    }
}