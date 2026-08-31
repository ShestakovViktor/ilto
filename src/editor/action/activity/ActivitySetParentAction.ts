import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";

export class ActivitySetParentAction extends Action<void> {
	name = "ActivitySetParentAction";

	private oldParentId: number;
	private newParentId: number;

	constructor(
		private session: Session,
		public params: {id: number}
	) {
		super();
		this.oldParentId = 0;
		this.newParentId = 0;
	}

	private hasRequiredProps(
		payload: undefined | Record<string, unknown>
	): payload is {parentId: number} {
		return payload != undefined
			&& "parentId" in payload;
	}

	exec(): void {
		const {payload} = this.session.activity;
		if (!this.hasRequiredProps(payload)) throw new Error();

		this.oldParentId = payload.parentId;
		this.newParentId = this.params.id;

		payload.parentId = this.newParentId;
	}

	undo(): void {
		const {payload} = this.session.activity;
		if (!this.hasRequiredProps(payload)) throw new Error();
		payload.parentId = this.oldParentId;
	}
}