import type {Entity} from "@src/storage/type/entity";
import type {Parent} from "@src/storage/type/property";
import {Action} from "@src/shared/controller";
import type {Storage} from "@src/storage/Storage";

export class ChildSetAction extends Action<void> {
	name = "ChildSetAction";

	constructor(
		private storage: Storage,
		public params: {
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
			parentId: this.params.parentId,
			childId: this.params.childId,
		};
	}

	exec(): void {
		const parent = this.storage.repo.entity
			.select<Entity & Parent>(this.params.parentId);

		const child = this.storage.repo.entity
			.select<Entity>(this.params.childId);

		if (!parent || !child) throw new Error();

		this.storage.repo.entity.update<Entity & Parent>(
			parent.id,
			{childIds: [...parent.childIds, child.id]}
		);
	}

	undo(): void {
		const parent = this.storage.repo.entity
			.select<Entity & Parent>(this.params.parentId);

		const child = this.storage.repo.entity
			.select<Entity>(this.params.childId);

		if (!parent || !child) throw new Error();

		this.storage.repo.entity.update<Entity & Parent>(
			this.params.parentId,
			{
				childIds: parent.childIds
					.filter(childId => childId != this.params.childId),
			}
		);
	}
}