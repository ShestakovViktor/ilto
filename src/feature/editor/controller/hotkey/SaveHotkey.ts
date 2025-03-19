import {Hotkey} from "@feature/editor/controller";
import {saveData} from "@feature/editor/service/data";

export class SaveHotkey extends Hotkey {
    protected code = "KeyS";

    protected ctrlKey = true;

    async handle(): Promise<void> {
        await saveData(
            this.storeContext.store,
            this.editorContext.archiveDriver
        );
    }
}