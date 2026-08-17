import {EntityKind} from "@src/core/enum";
import type {Image} from "@src/core/type/entity";
import {Action} from "@src/core/library";
import type {DataStorage} from "@src/core/controller";

export class ImageCreateAction extends Action<Image> {
	name = "ImageCreateAction";

	private imageId?: number;

	constructor(
		private storage: DataStorage,
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