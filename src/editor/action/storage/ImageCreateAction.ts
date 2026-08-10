import {EntityKind} from "@src/core/enum";
import type {Image} from "@src/core/type";
import {Action} from "@src/editor/controller";
import type {Storage} from "@src/core/controller";

export class ImageCreateAction extends Action<Image> {
	name = "ImageCreateAction";

	private imageId?: number;

	constructor(
		private storage: Storage,
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
			assetId: number;
		}
	) {
		super();
	}

	getLogMessage(): string {
		return "create image";
	}

	getLogData(): Record<string, unknown> {
		return {
			imageId: this.imageId,
			props: this.payload,
		};
	}

	exec(): Image {
		const image = this.storage.entity.create<Image>({
			kind: EntityKind.Image,
			prop: [],
			...this.payload,
		});

		this.imageId = image.id;

		return image;
	}

	undo(): void {
		if (this.imageId) {
			this.storage.entity.delete(this.imageId);
		}
	}
}