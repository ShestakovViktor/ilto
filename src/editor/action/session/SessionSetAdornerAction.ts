import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";
import type {Adorner} from "@src/viewer/adorner";
import type {AdornerRole} from "@src/editor/enum";

export class SessionSetAdornerAction extends Action<void> {
	name = "SessionSetAdornerAction";

	constructor(
		private session: Session,
		public params: {
			role: AdornerRole;
			adorner: Adorner;
		}
	) {
		super();
	}

	exec(): void {
		this.session.adorner[this.params.role] = this.params.adorner;
	}

	undo(): void {
	}
}