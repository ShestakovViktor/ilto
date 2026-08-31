import {Action} from "@src/core/library";
import type {Session} from "@src/editor/type";
import type {InputKind} from "@src/editor/enum";

export class InputSetAction extends Action<void> {
	name = "InputSetAction";

	constructor(
		private session: Session,
		public payload: {
			input: InputKind;
		}
	) {
		super();
	}

	exec(): void {
		this.session.inputKind = this.payload.input;
	}

	undo(): void {
	}
}