import type {GraphicsDriver} from "@src/core/interface";
import {type Action, Script} from "@src/core/library";
import {
	AssetCreateAction,
	ImageCreateAction,
	ChildSetAction,
} from "@src/core/action/storage";
import type {DataStorage} from "@src/core/controller";
import type {Stats} from "@src/core/type";

export class ImageCreateSingleScript extends Script<void> {
	name = "ImageCreateSingleScript";

	constructor (
		private storage: DataStorage,
		private stats: Stats,
		private graphics: GraphicsDriver,
		public payload: {
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

	protected async run(
		exec: <R>(item: Action<R>) => Promise<R>
	): Promise<void> {
		const asset = await exec(new AssetCreateAction(this.storage, {
			path: URL.createObjectURL(this.payload.file),
			size: this.payload.file.size,
			mime: this.payload.file.type,
			name: this.payload.file.name,
			meta: {footnote: ""},
		}));

		const image = await exec(new ImageCreateAction(this.storage, {
			x: this.payload.x - this.payload.pivotX * this.payload.width,
			y: this.payload.y - this.payload.pivotY * this.payload.height,
			width: this.payload.width,
			height: this.payload.height,
			rotation: this.payload.rotation,
			scaleX: this.payload.scaleX,
			scaleY: this.payload.scaleY,
			pivotX: this.payload.pivotX,
			pivotY: this.payload.pivotY,
			assetId: asset.id,
		}));

		await exec(new ChildSetAction(this.storage, {
			parentId: this.payload.parentId,
			childId: image.id,
		}));
	}

	async undo(): Promise<void> {

	}
}
