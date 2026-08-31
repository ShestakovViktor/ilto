import type {EntityKind} from "@src/storage/enum";
import type {Entity} from "@src/storage/type/entity";
import {Action} from "@src/shared/controller";
import type {DataRepository} from "@src/storage/controller";

export class EntityCreateAction extends Action<Entity> {
	name = "EntityCreateAction";

	private imageId?: number;

	constructor(
		private storage: DataRepository,
		public payload: {
			kind: EntityKind;
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

	exec(): Entity {
		const image = this.storage.entity.create<Entity>({
			...this.payload,
			prop: [],
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