import {type ActionEngine, Hotkey} from "@src/editor/controller";

export class RedoHotkey extends Hotkey {
	protected code = "KeyZ";

	protected ctrlKey = true;

	protected shiftKey = true;

	constructor(private engine: ActionEngine) {
		super();
	}

	async handle(): Promise<void> {
		await this.engine.redo();
	}
}