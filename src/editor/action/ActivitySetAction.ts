import {Action} from "@src/core/library";
import type {Session} from "@src/editor/type";
import type {Activities} from "@src/editor/type/activity";

export class ActivitySetAction extends Action<void> {
	name = "ActivitySetAction";

	constructor(
		private session: Session,
		public payload: {
			activity: Activities;
		}
	) {
		super();
	}

	exec(): void {
		this.session.activity = this.payload.activity;
	}

	undo(): void {
	}
}