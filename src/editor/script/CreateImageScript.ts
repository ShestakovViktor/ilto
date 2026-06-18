import {MimeType} from "@src/core/enum";
import type {GraphicsDriver} from "@src/core/interface";
import {type Action, Script} from "@src/editor/controller";
import {
	CreateAssetAction,
	CreateImageAction,
	SetChildAction,
} from "@src/editor/action/storage";
import type {Storage} from "@src/core/controller";

export class CreateImageScript extends Script<void> {
	name = "CreateImageScript";

	constructor (
		private storage: Storage,
		private graphics: GraphicsDriver,
		public payload: {
			x: number;
			y: number;
			w: number;
			h: number;
			file: File;
		}
	){
		super();
	}

	protected async run(
		exec: <R>(item: Action<R>) => Promise<R>
	): Promise<void> {
		let files: {
			x: number;
			y: number;
			w: number;
			h: number;
			f: File;
		}[] = [];

		if (this.payload.file.type == MimeType.Svg) {
			files = [{
				x: this.payload.x,
				y: this.payload.y,
				w: this.payload.w,
				h: this.payload.h,
				f: await this.graphics.prepareSvg(this.payload.file),
			}];
		}
		else {
			files = await this.graphics.prepareImg(
				this.payload.file,
				this.payload.w,
				this.payload.h,
				128
			);
		}

		for (const graphics of files) {
			const asset = await exec(new CreateAssetAction(this.storage, {
				path: URL.createObjectURL(graphics.f),
				size: graphics.f.size,
				mime: graphics.f.type,
				name: graphics.f.name,
				meta: {footnote: ""},
			}));

			const image = await exec(new CreateImageAction(this.storage, {
				x: graphics.x,
				y: graphics.y,
				w: graphics.w,
				h: graphics.h,
				assetId: asset.id,
			}));

			await exec(new SetChildAction(this.storage, {
				parentId: 1,
				childId: image.id,
			}));

		}
	}
}
