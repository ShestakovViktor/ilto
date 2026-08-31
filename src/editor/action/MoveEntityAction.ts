import {Action} from "@src/shared/controller";
import type {Entity} from "@src/storage/type/entity";
import {isSpatial, type Spatial} from "@src/storage/type/property";
import type {DataRepository} from "@src/storage/controller";

export class MoveEntityAction extends Action<void> {
	name = "MoveEntityAction";

	constructor(
		private storage: DataRepository,
		public params: {
			entityId: number;
			shiftX: number;
			shiftY: number;
		}
	) {
		super();
	}

	exec(): void {
		const entity = this.storage.entity.select(this.params.entityId);

		if (!entity || !isSpatial(entity)) throw new Error();

		this.storage.entity.update<Entity & Spatial>(
			this.params.entityId,
			{
				x: entity.x + this.params.shiftX,
				y: entity.y + this.params.shiftY,
			}
		);
	}

	undo(): void {
		const entity = this.storage.entity.select(this.params.entityId);

		if (!entity || !isSpatial(entity)) throw new Error();

		this.storage.entity.update<Entity & Spatial>(
			this.params.entityId,
			{
				x: entity.x - this.params.shiftX,
				y: entity.y - this.params.shiftY,
			}
		);
	}
}