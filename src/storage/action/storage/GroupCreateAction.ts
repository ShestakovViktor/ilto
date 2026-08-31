import {EntityKind} from "@src/storage/enum";
import {Action} from "@src/shared/controller";
import type {Group} from "@src/storage/type/entity";
import type {Storage} from "@src/storage/Storage";

export class GroupCreateAction extends Action<Group> {
	name = "GroupCreateAction";

	private groupId?: number;

	constructor(
		private storage: Storage,
		public params: {
			name: string;
			x: number;
			y: number;
			rotation: number;
			scaleX: number;
			scaleY: number;
			pivotX: number;
			pivotY: number;
			childIds: number[];
		}
	) {
		super();
	}

	exec(): Group {
		const group = this.storage.repo.entity.create<Group>({
			kind: EntityKind.Group,
			prop: [],
			...this.params,
		});

		this.groupId = group.id;

		return group;
	}

	undo(): void {
		if (this.groupId) {
			this.storage.repo.entity.delete(this.groupId);
		}
	}
}