import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";
import type {Drafts} from "@src/editor/type/draft";

export class DraftSetAction<D extends Drafts> extends Action<void> {
	name = "DraftSetAction";

	constructor(
		private session: Session,
		public payload: D
	) {
		super();
	}

	apply(): void {
		this.session.draft = {...this.payload};
	}

	revert(): void {
	}
}