import type {Entity, Parent} from "@src/core/type";
import {Action} from "@src/editor/controller";
import type {Storage} from "@src/core/controller";

export class ChildSetAction extends Action<void> {
	name = "ChildSetAction";

	constructor(
		private storage: Storage,
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

	exec(): void {
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

	undo(): void {
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