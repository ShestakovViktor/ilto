import {Hotkey} from "@src/editor/controller";
import {saveData} from "@src/editor/service";
import type {Storage} from "@src/storage/controller";
import type {
	WebLinkerDriver,
	WebFetcherDriver,
} from "@src/core/driver";
import type {ArchiverDriver} from "@src/core/interface";

export class SaveHotkey extends Hotkey {
	protected code = "KeyS";

	protected ctrlKey = true;

	constructor(
		private storage: Storage,
		private linker: WebLinkerDriver,
		private archiver: ArchiverDriver,
		private browser: WebFetcherDriver
	) {
		super();
	}

	async handle(): Promise<void> {
		await saveData(this.storage, this.linker, this.archiver, this.browser);
	}
}