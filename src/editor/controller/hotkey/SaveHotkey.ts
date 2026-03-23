import {Hotkey} from "@src/editor/controller";
import {saveData} from "@src/editor/service";
import {Storage} from "@src/storage/controller";
import {
    WebBlobDriver,
    WebStashDriver,
} from "@src/utility/driver";
import {ArchiveDriver} from "@src/utility/interface";

export class SaveHotkey extends Hotkey {
    protected code = "KeyS";

    protected ctrlKey = true;

    constructor(
        private storage: Storage,
        private linker: WebBlobDriver,
        private archiver: ArchiveDriver,
        private browser: WebStashDriver
    ) {
        super();
    }

    async handle(): Promise<void> {
        await saveData(this.storage, this.linker, this.archiver, this.browser);
    }
}