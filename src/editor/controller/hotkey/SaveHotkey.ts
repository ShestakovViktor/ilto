import {Hotkey} from "@src/editor/controller";
import {saveData} from "@src/editor/service";
import {Database} from "@src/shared/controller";
import {WebBlobDriver, WebStashDriver} from "@src/shared/driver";
import {ArchiveDriver} from "@src/shared/interface";

export class SaveHotkey extends Hotkey {
    protected code = "KeyS";

    protected ctrlKey = true;

    constructor(
        private database: Database,
        private linker: WebBlobDriver,
        private archiver: ArchiveDriver,
        private browser: WebStashDriver
    ) {
        super();
    }

    async handle(): Promise<void> {
        await saveData(this.database, this.linker, this.archiver, this.browser);
    }
}