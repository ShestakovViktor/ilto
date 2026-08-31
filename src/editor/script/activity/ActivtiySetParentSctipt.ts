import type {Session} from "@src/editor/type";
import {type Action, Script} from "@src/shared/controller";
import {AdornerKind} from "@src/viewer/adorner";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import {ActivitySetParentAction, ActivitySetPositionAction} from "@src/editor/action/activity";
import {
	SessionSetAdornerAction,
	SessionSyncAdornersAction,
} from "@src/editor/action/session";
import {AdornerRole} from "@src/editor/enum";
import type {Viewer} from "@src/viewer/Viewer";
import {mat3, type Vec2, vec2} from "@src/shared/math";
import type {Activities} from "@src/editor/type/activity";

export class ActivitySetParentScript extends Script<void> {
	name = "ActivitySetParentScript";

	private mutationQueue: Action<unknown>[] = [];
	private updateQueue: Action<unknown>[] = [];

	constructor (
		private viewer: Viewer,
		private session: Session,
		public params: {id: number}
	){
		super();

	}

	protected async invoke(): Promise<void> {
		const newDraftPos = this.calcDraftPosition(this.params);
		await this.setDraftPosition(newDraftPos);
		await this.setActivityParent(this.params);

		const adornerPos = this.calcAdornerPosition(this.params);
		await this.setAdorner(adornerPos);
		await this.updateAdorner();
		await this.updateScene();
	}

	private hasRequiredProps(
		activity: Activities
	): activity is Activities & {
		payload: {parentId: number; x: number; y: number};
	} {
		return typeof activity === "object"
			&& "payload" in activity
			&& typeof activity.payload === "object"
			&& "parentId" in activity.payload
			&& "x" in activity.payload
			&& "y" in activity.payload;
	}

	private calcDraftPosition(parent: {id: number}): Vec2 {
		if (!this.hasRequiredProps(this.session.activity)) throw new Error();

		const oldParentId = this.session.activity.payload.parentId;
		const newParentId = parent.id;

		const oldDraftPos = vec2.init(
			this.session.activity.payload.x,
			this.session.activity.payload.y
		);

		const oldWorldMatrix = this.viewer.scene.getMatrixById(oldParentId);
		const newWorldMatrix = this.viewer.scene.getMatrixById(newParentId);

		if (!oldWorldMatrix || !newWorldMatrix) throw new Error();

		const newDraftPos = mat3.multiplyVec2(
			vec2.create(),
			oldWorldMatrix,
			oldDraftPos
		);

		const newInvWorldMatrix = mat3.invert(mat3.create(), newWorldMatrix);

		mat3.multiplyVec2(newDraftPos, newInvWorldMatrix, newDraftPos);

		return newDraftPos;
	}

	private async setDraftPosition(localPos: Vec2) {
		const action = new ActivitySetPositionAction(
			this.session,
			{x: localPos[0], y: localPos[1]}
		);
		await this.engine.exec(action);
		this.mutationQueue.unshift(action);
	}

	private async setActivityParent(parent: {id: number}) {
		const action = new ActivitySetParentAction(this.session, parent);
		await this.engine.exec(action);
		this.mutationQueue.unshift(action);
	}

	private calcAdornerPosition(parent: {id: number}) {
		const newWorldMatrix = this.viewer.scene.getMatrixById(parent.id);
		if (!newWorldMatrix) throw new Error();

		const newParentAdornPos = vec2.init(0, 0);
		return mat3.multiplyVec2(
			newParentAdornPos,
			newWorldMatrix,
			newParentAdornPos
		);
	}

	private async setAdorner(worldPos: Vec2) {
		const action = new SessionSetAdornerAction(
			this.session,
			{
				role: AdornerRole.parentEntityPivot,
				adorner: {
					x: worldPos[0],
					y: worldPos[1],
					kind: AdornerKind.Pivot,
					color: {r: 0, g: 0.6, b: 0.6, a: 1},
				},
			}
		);
		await this.engine.exec(action);
		this.mutationQueue.unshift(action);
	}

	private async updateAdorner() {
		const action = new SessionSyncAdornersAction(
			this.session,
			this.viewer.adorner
		);
		await this.engine.exec(action);
		this.updateQueue.push(action);
	}

	private async updateScene() {
		const action = new SceneUpdateAction(this.viewer);
		await this.engine.exec(action);
		this.updateQueue.push(action);
	}

	async revert(): Promise<void> {
		for (const action of this.mutationQueue) {
			await this.engine.undo(action);
		}

		for (const action of this.updateQueue) {
			await this.engine.undo(action);
		}
	}
}
