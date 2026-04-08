import {Engine, Hotkey} from "@src/editor/controller";

export class UndoHotkey extends Hotkey {
    protected code = "KeyZ";

    protected ctrlKey = true;

    constructor(private engine: Engine) {
        super();
    }

    handle(): void {
        this.engine.undo();
    }
}