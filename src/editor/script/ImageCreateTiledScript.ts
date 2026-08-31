import type {GraphicsDriver} from "@src/shared/interface";
import {type Action, Script} from "@src/shared/controller";
import {
	AssetCreateAction,
	ImageCreateAction,
	ChildSetAction,
	GroupCreateAction,
} from "@src/storage/action/storage";
import type {DataRepository} from "@src/storage/controller";
import type {Stats} from "@src/storage/type";
import {RevisionBumpAction} from "@src/storage/action/stats";

export class ImageCreateTiledScript extends Script<void> {
	name = "ImageCreateTiledScript";

	constructor (
		private storage: DataRepository,
		private stats: Stats,
		private graphics: GraphicsDriver,
		public payload: {
			name: string;
			x: number;
			y: number;
			width: number;
			height: number;
			rotation: number;
			scaleX: number;
			scaleY: number;
			pivotX: number;
			pivotY: number;
			file: File;
			parentId: number;
		}
	){
		super();
	}

	protected async applying(
		exec: <R>(item: Action<R>) => Promise<R>
	): Promise<void> {
		const group = await exec(
			new GroupCreateAction(
				this.storage,
				{
					name: this.payload.name,
					x: this.payload.x,
					y: this.payload.y,
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
					pivotX: .5,
					pivotY: .5,
					childIds: [],
				}
			)
		);

		await exec(
			new ChildSetAction(
				this.storage,
				{
					parentId: this.payload.parentId,
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

		files = await this.graphics.prepareImg(
			this.payload.file,
			this.payload.width,
			this.payload.height,
			480
		);

		for (const graphics of files) {
			const asset = await exec(
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

			const image = await exec(
				new ImageCreateAction(
					this.storage,
					{
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

			await exec(
				new ChildSetAction(
					this.storage,
					{
						parentId: group.id,
						childId: image.id,
					}
				)
			);

		}

		await exec(
			new RevisionBumpAction(this.stats)
		);
	}

	async reverting(): Promise<void> {

	}
}
