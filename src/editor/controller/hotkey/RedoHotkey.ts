import {Engine, Hotkey} from "@src/editor/controller";

export class RedoHotkey extends Hotkey {
    protected code = "KeyZ";

    protected ctrlKey = true;

    protected shiftKey = true;

    constructor(private engine: Engine) {
        super();
    }

    handle(): void {
        this.engine.redo();
    }
}