import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";
import {isSpatial} from "@src/storage/type/property";

export class DraftParentSetAction extends Action<void> {
	name = "DraftParentSetAction";

	private oldParentId: number;
	private newParentId: number;

	constructor(
		private session: Session,
		public payload: {id: number}
	) {
		super();
		this.oldParentId = 0;
		this.newParentId = 0;
	}

	exec(): void {
		if (!isSpatial(this.session.draft)) throw new Error();

		this.oldParentId = this.session.draft.parentId;
		this.newParentId = this.payload.id;

		this.session.draft.parentId = this.newParentId;
	}

	undo(): void {
		if (!isSpatial(this.session.draft)) throw new Error();
		this.session.draft.parentId = this.oldParentId;
	}
}