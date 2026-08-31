import {EntityKind} from "@src/storage/enum";
import type {Image} from "@src/storage/type/entity";
import {Action} from "@src/shared/controller";
import type {DataRepository} from "@src/storage/controller";

export class ImageCreateAction extends Action<Image> {
	name = "ImageCreateAction";

	private imageId?: number;

	constructor(
		private storage: DataRepository,
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

	apply(): Image {
		const image = this.storage.entity.create<Image>({
			kind: EntityKind.Image,
			prop: [],
			...this.payload,
		});

		this.imageId = image.id;

		return image;
	}

	revert(): void {
		if (this.imageId) {
			this.storage.entity.delete(this.imageId);
		}
	}
}