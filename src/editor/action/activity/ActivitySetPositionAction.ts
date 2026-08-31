import {Action} from "@src/shared/controller";
import type {Session} from "@src/editor/type";
import {type Vec2, vec2} from "@src/shared/math";

export class ActivitySetPositionAction extends Action<void> {
	name = "ActivitySetPositionAction";

	private oldPosition: Vec2;
	private newPosition: Vec2;

	constructor(
		private session: Session,
		public params: {x: number; y: number}
	) {
		super();
		this.oldPosition = vec2.create();
		this.newPosition = vec2.create();
	}

	private hasRequiredProps(
		payload: Record<string, unknown> | undefined
	): payload is {x: number; y: number} {
		return payload != undefined
			&& "x" in payload
			&& "y" in payload;
	}

	exec(): void {
		const {payload} = this.session.activity;

		if (!this.hasRequiredProps(payload)) throw new Error();

		vec2.set(
			this.oldPosition,
			payload.x,
			payload.y
		);
		vec2.set(this.newPosition, this.params.x, this.params.y);

		payload.x = this.newPosition[0];
		payload.y = this.newPosition[1];
	}

	undo(): void {
		const {payload} = this.session.activity;
		if (!this.hasRequiredProps(payload)) throw new Error();
		payload.x = this.oldPosition[0];
		payload.y = this.oldPosition[1];
	}
}