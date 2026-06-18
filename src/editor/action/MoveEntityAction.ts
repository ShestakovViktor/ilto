import {Action} from "@src/editor/controller";
import {type Entity, isSpatial, type Spatial} from "@src/core/type";
import type {Storage} from "@src/core/controller";

export class MoveEntityAction extends Action<void> {
	name = "MoveEntityAction";

	constructor(
		private storage: Storage,
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