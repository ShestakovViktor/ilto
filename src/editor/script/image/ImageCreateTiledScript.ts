import {Script} from "@src/shared/controller";
import {
	AssetCreateAction,
	ImageCreateAction,
	ChildSetAction,
	GroupCreateAction,
} from "@src/storage/action/storage";
import {RevisionBumpAction} from "@src/storage/action/stats";
import type {Storage} from "@src/storage/Storage";
import type {ImageDraft} from "@src/editor/type/draft";

export class ImageCreateTiledScript extends Script<void> {
	name = "ImageCreateTiledScript";

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
		const group = await this.engine.exec(
			new GroupCreateAction(
				this.storage,
				{
					name: this.params.draft.name,
					x: this.params.draft.x,
					y: this.params.draft.y,
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
					pivotX: .5,
					pivotY: .5,
					childIds: [],
				}
			)
		);

		await this.engine.exec(
			new ChildSetAction(
				this.storage,
				{
					parentId: this.params.parentId,
					childId: group.id,
				}
			)

		);

		let files: {
			x: number;
			y: number;
			width: number;
			height: number;
			file: File;
		}[] = [];

		files = await this.storage.graphics.prepareImg(
			this.params.file,
			this.params.draft.width,
			this.params.draft.height,
			480
		);

		for (const graphics of files) {
			const asset = await this.engine.exec(
				new AssetCreateAction(
					this.storage,
					{
						path: URL.createObjectURL(graphics.file),
						size: graphics.file.size,
						mime: graphics.file.type,
						name: graphics.file.name,
						meta: {footnote: ""},
					}
				)
			);

			const image = await this.engine.exec(
				new ImageCreateAction(
					this.storage,
					{
						name: "",
						x: graphics.x,
						y: graphics.y,
						width: graphics.width,
						height: graphics.height,
						rotation: 0,
						scaleX: 1,
						scaleY: 1,
						pivotX: .5,
						pivotY: .5,
						assetId: asset.id,
					}
				)
			);

			await this.engine.exec(
				new ChildSetAction(
					this.storage,
					{
						parentId: group.id,
						childId: image.id,
					}
				)
			);

		}

		await this.engine.exec(
			new RevisionBumpAction(this.storage.stats)
		);
	}

	async revert(): Promise<void> {

	}
}
