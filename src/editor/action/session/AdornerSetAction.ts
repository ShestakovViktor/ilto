import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";
import type {Adorner} from "@src/viewer/adorner";
import type {AdornerRole} from "@src/editor/enum";

export class AdornerSetAction extends Action<void> {
	name = "AdornerSetAction";

	constructor(
		private session: Session,
		public payload: {
			role: AdornerRole;
			adorner: Adorner;
		}
	) {
		super();
	}

	apply(): void {
		this.session.adorner[this.payload.role] = this.payload.adorner;
	}

	revert(): void {
	}
}