import type {ImageDraft} from "@src/editor/type/draft";
import {Script} from "@src/shared/controller";
import {
	AssetCreateAction,
	ImageCreateAction,
	ChildSetAction,
} from "@src/storage/action/storage";
import type {Storage} from "@src/storage/Storage";

export class ImageCreateSingleScript extends Script<void> {
	name = "ImageCreateSingleScript";

	constructor (
		private storage: Storage,
		public params: {
			parentId: number;
			file: File;
			draft: ImageDraft;
		}
	){
		super();
	}

	protected async invoke(): Promise<void> {
		const {draft} = this.params;
		const asset = await this.engine.exec(
			new AssetCreateAction(this.storage, {
				path: URL.createObjectURL(this.params.file),
				size: this.params.file.size,
				mime: this.params.file.type,
				name: this.params.file.name,
				meta: {footnote: ""},
			})
		);

		const image = await this.engine.exec(
			new ImageCreateAction(this.storage, {
				name: draft.name,
				x: draft.x,
				y: draft.y,
				width: draft.width,
				height: draft.height,
				rotation: draft.rotation,
				scaleX: draft.scaleX,
				scaleY: draft.scaleY,
				pivotX: draft.pivotX,
				pivotY: draft.pivotY,
				assetId: asset.id,
			})
		);

		await this.engine.exec(
			new ChildSetAction(this.storage, {
				parentId: this.params.parentId,
				childId: image.id,
			})
		);
	}

	async revert(): Promise<void> {

	}
}
