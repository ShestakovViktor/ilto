import {Action} from "@src/shared/controller";
import type {Scene} from "@src/viewer/shared/controller";
import type {Session} from "@src/editor/type";
import {isSpatial} from "@src/storage/type/property";
import {type Mat3, mat3, type Vec2, vec2} from "@src/shared/math";

export class DraftParentSetAction extends Action<void> {
	name = "DraftParentSetAction";

	private oldParentId: number;
	private newParentId: number;
	private oldPosition: Vec2;
	private newPosition: Vec2;
	private newInvWorldMatrix: Mat3;

	constructor(
		private scene: Scene,
		private session: Session,
		public payload: {
			id: number;
		}
	) {
		super();
		this.oldParentId = 0;
		this.newParentId = 0;
		this.oldPosition = vec2.create();
		this.newPosition = vec2.create();
		this.newInvWorldMatrix = mat3.create();
	}

	apply(): void {
		if (!isSpatial(this.session.draft)) throw new Error();

		this.oldParentId = this.session.draft.parentId;
		this.newParentId = this.payload.id;
		vec2.set(
			this.oldPosition,
			this.session.draft.x,
			this.session.draft.y
		);

		const oldWorldMatrix = this.scene.getMatrixById(this.oldParentId);
		const newWorldMatrix = this.scene.getMatrixById(this.newParentId);

		if (!oldWorldMatrix || !newWorldMatrix) return;

		mat3.multiplyVec2(this.newPosition, oldWorldMatrix, this.oldPosition);

		mat3.invert(this.newInvWorldMatrix, newWorldMatrix);

		mat3.multiplyVec2(
			this.newPosition,
			this.newInvWorldMatrix,
			this.newPosition
		);

		this.session.draft.parentId = this.newParentId;
		this.session.draft.x = this.newPosition[0];
		this.session.draft.y = this.newPosition[1];
	}

	revert(): void {
		if (!isSpatial(this.session.draft)) throw new Error();
		this.session.draft.parentId = this.oldParentId;
		this.session.draft.x = this.oldPosition[0];
		this.session.draft.y = this.oldPosition[1];
	}
}