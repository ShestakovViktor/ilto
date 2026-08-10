import {MimeType} from "@src/core/enum";
import type {GraphicsDriver} from "@src/core/interface";
import {type Action, Script} from "@src/editor/controller";
import {
	AssetCreateAction,
	ImageCreateAction,
	ChildSetAction,
} from "@src/editor/action/storage";
import type {Storage} from "@src/core/controller";

export class ImageCreateScript extends Script<void> {
	name = "ImageCreateScript";

	constructor (
		private storage: Storage,
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
		}
	){
		super();
	}

	protected async run(
		exec: <R>(item: Action<R>) => Promise<R>
	): Promise<void> {

		if (!this.payload.width || !this.payload.height) {
			const bitmap = await createImageBitmap(this.payload.file);
			this.payload.width = bitmap.width;
			this.payload.height = bitmap.height;
			bitmap.close();
		}

		const asset = await exec(new AssetCreateAction(this.storage, {
			path: URL.createObjectURL(this.payload.file),
			size: this.payload.file.size,
			mime: this.payload.file.type,
			name: this.payload.file.name,
			meta: {footnote: ""},
		}));

		console.log(this.payload.pivotX, this.payload.pivotY);

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
			parentId: 1,
			childId: image.id,
		}));

		// let files: {
		// 	x: number;
		// 	y: number;
		// 	w: number;
		// 	h: number;
		// 	f: File;
		// }[] = [];

		// if (this.payload.file.type == MimeType.Svg) {
		// 	files = [{
		// 		x: this.payload.x,
		// 		y: this.payload.y,
		// 		w: this.payload.w,
		// 		h: this.payload.h,
		// 		f: await this.graphics.prepareSvg(this.payload.file),
		// 	}];
		// }
		// else {
		// 	files = await this.graphics.prepareImg(
		// 		this.payload.file,
		// 		this.payload.w,
		// 		this.payload.h,
		// 		480
		// 	);
		// }

		// for (const graphics of files) {
		// 	const asset = await exec(new AssetCreateAction(this.storage, {
		// 		path: URL.createObjectURL(graphics.f),
		// 		size: graphics.f.size,
		// 		mime: graphics.f.type,
		// 		name: graphics.f.name,
		// 		meta: {footnote: ""},
		// 	}));

		// 	const image = await exec(new ImageCreateAction(this.storage, {
		// 		x: graphics.x,
		// 		y: graphics.y,
		// 		w: graphics.w,
		// 		h: graphics.h,
		// 		r: 0,
		// 		p: 1,
		// 		q: 1,
		// 		assetId: asset.id,
		// 	}));

		// 	await exec(new ChildSetAction(this.storage, {
		// 		parentId: 1,
		// 		childId: image.id,
		// 	}));

		// }
	}
}
