import {type ActionEngine, Hotkey} from "@src/editor/controller";

export class UndoHotkey extends Hotkey {
	protected code = "KeyZ";

	protected ctrlKey = true;

	constructor(private engine: ActionEngine) {
		super();
	}

	async handle(): Promise<void> {
		await this.engine.undo();
	}
}