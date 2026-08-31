import {Action} from "@src/shared/controller";
import type {Entity} from "@src/storage/type/entity";
import {isSpatial, type Spatial} from "@src/storage/type/property";
import type {DataRepository} from "@src/storage/controller";

export class MoveEntityAction extends Action<void> {
	name = "MoveEntityAction";

	constructor(
		private storage: DataRepository,
		public payload: {
			entityId: number;
			shiftX: number;
			shiftY: number;
		}
	) {
		super();
	}

	apply(): void {
		const entity = this.storage.entity.select(this.payload.entityId);

		if (!entity || !isSpatial(entity)) throw new Error();

		this.storage.entity.update<Entity & Spatial>(
			this.payload.entityId,
			{
				x: entity.x + this.payload.shiftX,
				y: entity.y + this.payload.shiftY,
			}
		);
	}

	revert(): void {
		const entity = this.storage.entity.select(this.payload.entityId);

		if (!entity || !isSpatial(entity)) throw new Error();

		this.storage.entity.update<Entity & Spatial>(
			this.payload.entityId,
			{
				x: entity.x - this.payload.shiftX,
				y: entity.y - this.payload.shiftY,
			}
		);
	}
}