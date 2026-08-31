import type {Session} from "@src/editor/type";
import {type Action, Script} from "@src/shared/controller";
import {AdornerKind, AdornerUpdateAction} from "@src/viewer/adorner";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import {DraftParentSetAction, DraftPositionSetAction} from "@src/editor/action/draft";
import {AdornerSetAction} from "@src/editor/action/session";
import {AdornerRole} from "@src/editor/enum";
import type {Viewer} from "@src/viewer/Viewer";
import {isSpatial} from "@src/storage/type/property";
import {mat3, type Vec2, vec2} from "@src/shared/math";

export class DraftParentChangeScript extends Script<void> {
	name = "DraftParentChangeScript";

	private queue: Action<unknown>[] = [];

	private adornerUpdateAction?: AdornerUpdateAction;
	private sceneUpdateAction?: SceneUpdateAction;

	constructor (
		private viewer: Viewer,
		private session: Session,
		public payload: {id: number}
	){
		super();

	}

	protected async invoke(): Promise<void> {
		const newDraftPos = this.calcDraftPosition(this.payload);
		await this.setDraftPosition(newDraftPos);
		await this.setDraftParent(this.payload);

		const adornerPos = this.calcAdornerPosition(this.payload);
		await this.setAdorner(adornerPos);
		await this.updateAdorner();
		await this.updateScene();
	}

	private async execAndTrack(action: Action<unknown>): Promise<void> {
		await this.engine.exec(action);
		this.queue.unshift(action);
	}

	private calcDraftPosition(parent: {id: number}): Vec2 {
		if (!isSpatial(this.session.draft)) throw new Error();

		const oldParentId = this.session.draft.parentId;
		const newParentId = parent.id;

		const oldDraftPos = vec2.init(
			this.session.draft.x,
			this.session.draft.y
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
		await this.execAndTrack(
			new DraftPositionSetAction(
				this.session,
				{x: localPos[0], y: localPos[1]}
			)
		);
	}

	private async setDraftParent(parent: {id: number}) {
		await this.execAndTrack(
			new DraftParentSetAction(this.session, parent)
		);
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
		await this.execAndTrack(
			new AdornerSetAction(
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
			)
		);
	}

	private async updateAdorner() {
		this.adornerUpdateAction = new AdornerUpdateAction(
			this.viewer.adorner,
			{adorners: Object.values(this.session.adorner)}
		);
		await this.engine.exec(this.adornerUpdateAction);
	}

	private async updateScene() {
		this.sceneUpdateAction = new SceneUpdateAction(
			this.viewer.scene,
			this.viewer.loop,
			this.viewer.canvas
		);
		await this.engine.exec(this.sceneUpdateAction);
	}

	async revert(): Promise<void> {
		for (const action of this.queue.reverse()) {
			await this.engine.undo(action);
		}

		if (this.adornerUpdateAction) {
			await this.engine.exec(this.adornerUpdateAction);
		}

		if (this.sceneUpdateAction) {
			await this.engine.exec(this.sceneUpdateAction);
		}
	}
}
