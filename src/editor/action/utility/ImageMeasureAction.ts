import {Action} from "@src/core/library";

export class ImageMeasureAction extends Action<{
	width: number;
	height: number;
}> {
	name = "ImageMeasureAction";

	constructor(
		public payload: {
			file: File;
		}
	) {
		super();
	}

	async exec(): Promise<{width: number; height: number}> {
		const bitmap = await createImageBitmap(this.payload.file);
		const result = {
			width: bitmap.width,
			height: bitmap.height,
		};

		bitmap.close();

		return result;
	}

	undo(): void {
	}
}