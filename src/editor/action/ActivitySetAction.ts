import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";
import type {Activities} from "@src/editor/type/activity";

export class ActivitySetAction extends Action<void> {
	name = "ActivitySetAction";

	constructor(
		private session: Session,
		public params: Activities
	) {
		super();
	}

	exec(): void {
		this.session.activity = {...this.params};
	}

	undo(): void {
	}
}