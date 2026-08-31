import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";
import {isSpatial} from "@src/storage/type/property";
import {type Vec2, vec2} from "@src/shared/math";

export class DraftPositionSetAction extends Action<void> {
	name = "DraftPositionSetAction";

	private oldPosition: Vec2;
	private newPosition: Vec2;

	constructor(
		private session: Session,
		public payload: {x: number; y: number}
	) {
		super();
		this.oldPosition = vec2.create();
		this.newPosition = vec2.create();
	}

	exec(): void {
		if (!isSpatial(this.session.draft)) throw new Error();

		vec2.set(this.oldPosition, this.session.draft.x, this.session.draft.y);
		vec2.set(this.newPosition, this.payload.x, this.payload.y);

		this.session.draft.x = this.newPosition[0];
		this.session.draft.y = this.newPosition[1];
	}

	undo(): void {
		if (!isSpatial(this.session.draft)) throw new Error();
		this.session.draft.x = this.oldPosition[0];
		this.session.draft.y = this.oldPosition[1];
	}
}