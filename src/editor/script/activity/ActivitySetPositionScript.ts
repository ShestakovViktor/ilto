import type {Session} from "@src/editor/type";
import {type Action, Script} from "@src/shared/controller";
import {AdornerKind} from "@src/viewer/adorner";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import {ActivitySetPositionAction} from "@src/editor/action/activity";
import {
	SessionSetAdornerAction,
	SessionSyncAdornersAction,
} from "@src/editor/action/session";
import {AdornerRole} from "@src/editor/enum";
import type {Viewer} from "@src/viewer/Viewer";
import {mat3, type Vec2, vec2} from "@src/shared/math";
import type {Activities} from "@src/editor/type/activity";

export class ActivitySetPositionScript extends Script<void> {
	name = "ActivitySetPositionScript";

	private mutationQueue: Action<unknown>[] = [];
	private updateQueue: Action<unknown>[] = [];

	constructor (
		private viewer: Viewer,
		private session: Session,
		public params: {x: number; y: number}
	){
		super();
	}

	protected async invoke(): Promise<void> {
		const localPosition = this.calcDraftPosition(this.params);

		await this.setDraftPosition(localPosition);
		await this.setAdorner(this.params);
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

	private calcDraftPosition(worldPos: {x: number; y: number}): Vec2 {
		if (!this.hasRequiredProps(this.session.activity)) throw new Error();

		const parentId = this.session.activity.payload.parentId;
		const parentWorldMatrix = this.viewer.scene.getMatrixById(parentId);
		if (!parentWorldMatrix) throw new Error();

		const transitionMatrix = mat3.create();
		mat3.invert(transitionMatrix, parentWorldMatrix);

		return mat3.multiplyVec2(
			vec2.create(),
			transitionMatrix,
			vec2.init(worldPos.x, worldPos.y)
		);
	}

	private async setDraftPosition(position: Vec2) {
		const action = new ActivitySetPositionAction(
			this.session,
			{x: position[0], y: position[1]}
		);
		await this.engine.exec(action);
		this.mutationQueue.unshift(action);
	}

	private async setAdorner(worldPos: {x: number; y: number}) {
		const action = new SessionSetAdornerAction(
			this.session,
			{
				role: AdornerRole.draftEntityPivot,
				adorner: {
					x: worldPos.x,
					y: worldPos.y,
					kind: AdornerKind.Pivot,
					color: {r: 0.6, g: 0, b: 0, a: 1},
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
