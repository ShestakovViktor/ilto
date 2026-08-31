import {Action} from "@src/shared/controller";
import type {Scene} from "@src/viewer/shared/controller";
import type {Session} from "@src/editor/type";
import {isSpatial} from "@src/storage/type/property";
import {type Mat3, mat3, type Vec2, vec2} from "@src/shared/math";

export class DraftPositionSetAction extends Action<void> {
	name = "DraftPositionSetAction";

	private oldPosition: Vec2;
	private newPosition: Vec2;
	private invWorldMatrix: Mat3;

	constructor(
		private scene: Scene,
		private session: Session,
		public payload: {
			x: number;
			y: number;
		}
	) {
		super();
		this.oldPosition = vec2.create();
		this.newPosition = vec2.create();
		this.invWorldMatrix = mat3.create();
	}

	apply(): void {
		if (!isSpatial(this.session.draft)) throw new Error();

		vec2.set(
			this.oldPosition,
			this.session.draft.x,
			this.session.draft.y
		);

		vec2.set(
			this.newPosition,
			this.payload.x,
			this.payload.y
		);

		const parentId = this.session.draft.parentId;
		const worldMatrix = this.scene.getMatrixById(parentId);

		if (!worldMatrix) return;

		mat3.invert(this.invWorldMatrix, worldMatrix);
		mat3.multiplyVec2(
			this.newPosition,
			this.invWorldMatrix,
			this.newPosition
		);

		this.session.draft.x = this.newPosition[0];
		this.session.draft.y = this.newPosition[1];
	}

	revert(): void {
		if (!isSpatial(this.session.draft)) throw new Error();
		this.session.draft.x = this.oldPosition[0];
		this.session.draft.y = this.oldPosition[1];
	}
}