import {Action} from "@src/editor/controller";

export class MockAction extends Action<void> {
	name = "MockAction";

	constructor(
		private onExec: () => void,
		private onUndo: () => void
	) {
		super();
	}

	exec(): void {
		this.onExec();
	}

	undo(): void {
		this.onUndo();
	}
}