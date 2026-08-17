import {EntityKind} from "@src/core/enum";
import {Action} from "@src/core/library";
import type {Group} from "@src/core/type/entity";
import type {DataStorage} from "@src/core/controller";

export class GroupCreateAction extends Action<Group> {
	name = "GroupCreateAction";

	private groupId?: number;

	constructor(
		private storage: DataStorage,
		public payload: {
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
		const group = this.storage.entity.create<Group>({
			kind: EntityKind.Group,
			prop: [],
			...this.payload,
		});

		this.groupId = group.id;

		return group;
	}

	undo(): void {
		if (this.groupId) {
			this.storage.entity.delete(this.groupId);
		}
	}
}