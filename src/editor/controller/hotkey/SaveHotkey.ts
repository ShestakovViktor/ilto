import {type ActionEngine, Hotkey} from "@src/editor/controller";
import {ProjectSaveAction} from "@src/storage/action/project";
import type {Storage} from "@src/storage/Storage";

export class SaveHotkey extends Hotkey {
	protected code = "KeyS";

	protected ctrlKey = true;

	constructor(
		private storage: Storage,
		private engine: ActionEngine
	) {
		super();
	}

	async handle(): Promise<void> {
		await this.engine.apply(
			new ProjectSaveAction(this.storage, {name: "save.ilto"})
		);
	}
}