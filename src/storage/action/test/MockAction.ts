import {Action} from "@src/shared/controller";

export class MockAction extends Action<void> {
	name = "MockAction";

	constructor(
		private onExec: () => void,
		private onUndo: () => void
	) {
		super();
	}

	apply(): void {
		this.onExec();
	}

	revert(): void {
		this.onUndo();
	}
}