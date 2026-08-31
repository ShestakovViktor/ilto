import type {Entity} from "@src/storage/type/entity";
import type {Parent} from "@src/storage/type/property";
import {Action} from "@src/shared/controller";
import type {DataRepository} from "@src/storage/controller";

export class ChildSetAction extends Action<void> {
	name = "ChildSetAction";

	constructor(
		private storage: DataRepository,
		public payload: {
			parentId: number;
			childId: number;
		}
	) {
		super();
	}

	getLogMessage(): string {
		return "set child";
	}

	getLogData(): Record<string, unknown> {
		return {
			parentId: this.payload.parentId,
			childId: this.payload.childId,
		};
	}

	apply(): void {
		const parent = this.storage.entity
			.select<Entity & Parent>(this.payload.parentId);

		const child = this.storage.entity
			.select<Entity>(this.payload.childId);

		if (!parent || !child) throw new Error();

		this.storage.entity.update<Entity & Parent>(
			parent.id,
			{childIds: [...parent.childIds, child.id]}
		);
	}

	revert(): void {
		const parent = this.storage.entity
			.select<Entity & Parent>(this.payload.parentId);

		const child = this.storage.entity
			.select<Entity>(this.payload.childId);

		if (!parent || !child) throw new Error();

		this.storage.entity.update<Entity & Parent>(
			this.payload.parentId,
			{
				childIds: parent.childIds
					.filter(childId => childId != this.payload.childId),
			}
		);
	}
}