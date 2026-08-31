import type {Session} from "@src/editor/type";
import {type Action, Script} from "@src/shared/controller";
import {AdornerKind, AdornerUpdateAction} from "@src/viewer/adorner";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import {DraftPositionSetAction} from "@src/editor/action/draft";
import {AdornerSetAction} from "@src/editor/action/session";
import {AdornerRole} from "@src/editor/enum";
import type {Viewer} from "@src/viewer/Viewer";
import {isChild} from "@src/storage/type/property";
import {mat3, type Vec2, vec2} from "@src/shared/math";

export class DraftPositionSetScript extends Script<void> {
	name = "DraftPositionSetScript";

	private queue: Action<unknown>[] = [];
	private adornerUpdateAction?: AdornerUpdateAction;
	private sceneUpdateAction?: SceneUpdateAction;

	constructor (
		private viewer: Viewer,
		private session: Session,
		public payload: {x: number; y: number}
	){
		super();
	}

	protected async invoke(): Promise<void> {
		const localPosition = this.calcDraftPosition(this.payload);

		await this.setDraftPosition(localPosition);
		await this.setAdorner(this.payload);
		await this.updateAdorner();
		await this.updateScene();
	}

	private calcDraftPosition(worldPos: {x: number; y: number}): Vec2 {
		if (!isChild(this.session.draft)) throw new Error();

		const parentId = this.session.draft.parentId;
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

	private async execAndTrack(action: Action<unknown>): Promise<void> {
		await this.engine.exec(action);
		this.queue.unshift(action);
	}

	private async setDraftPosition(position: Vec2) {
		const draftPositionSetAction = new DraftPositionSetAction(
			this.session,
			{x: position[0], y: position[1]}
		);
		await this.execAndTrack(draftPositionSetAction);
	}

	private async setAdorner(worldPos: {x: number; y: number}) {
		await this.execAndTrack(
			new AdornerSetAction(
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
		for (const action of this.queue) {
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
