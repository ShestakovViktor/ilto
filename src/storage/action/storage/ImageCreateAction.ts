import {EntityKind} from "@src/storage/enum";
import type {Image} from "@src/storage/type/entity";
import {Action} from "@src/shared/controller";
import type {Storage} from "@src/storage/Storage";

export class ImageCreateAction extends Action<Image> {
	name = "ImageCreateAction";

	private imageId?: number;

	constructor(
		private storage: Storage,
		public params: {
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
			assetId: number;
		}
	) {
		super();
	}

	exec(): Image {
		const image = this.storage.repo.entity.create<Image>({
			kind: EntityKind.Image,
			prop: [],
			...this.params,
		});

		this.imageId = image.id;

		return image;
	}

	undo(): void {
		if (this.imageId) {
			this.storage.repo.entity.delete(this.imageId);
		}
	}
}