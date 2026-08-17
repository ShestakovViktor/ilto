import {type ActionEngine, Hotkey} from "@src/editor/controller";
import type {DataStorage} from "@src/core/controller";
import type {
	ArchiverDriver,
	FetcherDriver,
	LinkerDriver,
} from "@src/core/interface";
import {ProjectSaveAction} from "@src/core/action/project";

export class SaveHotkey extends Hotkey {
	protected code = "KeyS";

	protected ctrlKey = true;

	constructor(
		private storage: DataStorage,
		private linker: LinkerDriver,
		private archiver: ArchiverDriver,
		private fetcher: FetcherDriver,
		private engine: ActionEngine
	) {
		super();
	}

	async handle(): Promise<void> {
		await this.engine.exec(
			new ProjectSaveAction(
				this.storage,
				this.linker,
				this.archiver,
				this.fetcher,
				{name: "save.ilto"}
			)
		);
	}
}