import {Action} from "@src/core/library";
import type {Entity} from "@src/core/type/entity";
import {isSpatial, type Spatial} from "@src/core/type/property";
import type {DataStorage} from "@src/core/controller";

export class MoveEntityAction extends Action<void> {
	name = "MoveEntityAction";

	constructor(
		private storage: DataStorage,
		public payload: {
			entityId: number;
			shiftX: number;
			shiftY: number;
		}
	) {
		super();
	}

	exec(): void {
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

	undo(): void {
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