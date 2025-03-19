import {Hotkey} from "@feature/editor/controller";

export class RedoHotkey extends Hotkey {
    protected code = "KeyZ";

    protected ctrlKey = true;

    protected shiftKey = true;

    handle(): void {
        this.editorContext.invoker.redo();
    }
}