import type {Session} from "@src/editor/type";
import {type Apply, type Revert, Script} from "@src/shared/controller";
import {AdornerKind, AdornerUpdateAction} from "@src/viewer/adorner";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import {DraftPositionSetAction} from "@src/editor/action/draft";
import {AdornerSetAction} from "@src/editor/action/session";
import {AdornerRole} from "@src/editor/enum";
import type {Viewer} from "@src/viewer/Viewer";

export class DraftPositionSetScript extends Script<void> {
	name = "DraftPositionSetScript";

	private draftPositionSetAction?: DraftPositionSetAction;
	private adornerSetAction?: AdornerSetAction;
	private adornerUpdateAction?: AdornerUpdateAction;
	private sceneUpdateAction?: SceneUpdateAction;

	constructor (
		private viewer: Viewer,
		private session: Session,
		public payload: {
			x: number;
			y: number;
		}
	){
		super();
	}

	protected async applying(apply: Apply): Promise<void> {

		this.draftPositionSetAction = new DraftPositionSetAction(
			this.viewer.scene,
			this.session,
			{x: this.payload.x, y: this.payload.y}
		);
		await apply(this.draftPositionSetAction);

		this.adornerSetAction = new AdornerSetAction(
			this.session,
			{
				role: AdornerRole.draftEntityPivot,
				adorner: {
					x: this.payload.x,
					y: this.payload.y,
					kind: AdornerKind.Pivot,
					color: {r: 0.6, g: 0, b: 0, a: 1},
				},
			}
		);

		await apply(this.adornerSetAction);

		this.adornerUpdateAction = new AdornerUpdateAction(
			this.viewer.adorner,
			{adorners: Object.values(this.session.adorner)}
		);
		await apply(this.adornerUpdateAction);

		this.sceneUpdateAction = new SceneUpdateAction(
			this.viewer.scene,
			this.viewer.loop,
			this.viewer.canvas
		);
		await apply(this.sceneUpdateAction);
	}

	async reverting(apply: Apply, revert: Revert): Promise<void> {
		if (
			!this.adornerUpdateAction
			|| !this.adornerSetAction
			|| !this.draftPositionSetAction
			|| !this.sceneUpdateAction
		) {
			throw new Error();
		}

		await revert(this.adornerUpdateAction);
		await revert(this.adornerSetAction);
		await revert(this.draftPositionSetAction);
		await apply(this.sceneUpdateAction);
	}
}
