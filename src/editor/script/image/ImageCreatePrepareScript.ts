import {Script} from "@src/shared/controller";
import {ActivitySetAction} from "@src/editor/action";
import {ActivityAction, ActivityTarget} from "@src/editor/enum";
import {isImageCreateActivity} from "@src/editor/type/activity";
import {PointerPositionResolveMode} from "@src/editor/controller/input-mode";
import type {Viewer} from "@src/viewer/Viewer";
import {ImageMeasureAction} from "@src/editor/action/utility";
import {
	ImageCreateSingleScript,
	ImageCreateTiledScript,
} from "@src/editor/script/image";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import type {Storage} from "@src/storage/Storage";
import type {Editor} from "@src/editor/Editor";
import {ActivitySetParentAction, ActivitySetPositionAction} from "@src/editor/action/activity";
import {ActivitySetPositionScript} from "../activity";

export class ImageCreatePrepareScript extends Script<void> {
	name = "ImageCreatePrepareScript";

	constructor (
		private storage: Storage,
		private viewer: Viewer,
		private editor: Editor
	){
		super();
	}

	protected async invoke(): Promise<void> {
		await this.engine.exec(
			new ActivitySetAction(this.editor.session, {
				target: ActivityTarget.Image,
				action: ActivityAction.Create,
				payload: {
					parentId: 1,
					isTiled: false,
					file: undefined,
					name: "",
					x: 0,
					y: 0,
					width: 0,
					height: 0,
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
					pivotX: 0,
					pivotY: 0,
				},
			})
		);

		this.editor.pointer.resolve(
			new PointerPositionResolveMode(this.viewer, async (data) => {
				await this.imageCreate(data);
			})
		);
	}

	async imageCreate(data: {x: number; y: number}): Promise<void> {
		if (!isImageCreateActivity(
			this.editor.session.activity
		)) throw new Error();

		const {payload} = this.editor.session.activity;

		await this.engine.exec(
			new ActivitySetPositionScript(
				this.viewer,
				this.editor.session,
				{
					x: data.x - payload.pivotX * payload.width,
					y: data.y - payload.pivotY * payload.height,
				})
		);

		if (!payload.file) throw new Error();

		const {parentId, file, isTiled, ...draft} = payload;

		await this.engine.exec(
			new ActivitySetAction(this.editor.session, {
				target: ActivityTarget.Entity,
				action: ActivityAction.Create,
			})
		);

		if (!isTiled) {
			await this.engine.exec(
				new ImageCreateSingleScript(
					this.storage,
					{parentId, file, draft}
				)
			);
		}
		else {
			await this.engine.exec(
				new ImageCreateTiledScript(
					this.storage,
					{parentId, file, draft}
				)
			);
		}

		await this.engine.exec(
			new SceneUpdateAction(this.viewer)
		);
	}

	async revert(): Promise<void> {

	}
}
