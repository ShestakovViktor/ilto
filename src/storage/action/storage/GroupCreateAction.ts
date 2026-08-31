import {EntityKind} from "@src/storage/enum";
import {Action} from "@src/shared/controller";
import type {Group} from "@src/storage/type/entity";
import type {DataRepository} from "@src/storage/controller";

export class GroupCreateAction extends Action<Group> {
	name = "GroupCreateAction";

	private groupId?: number;

	constructor(
		private storage: DataRepository,
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

	apply(): Group {
		const group = this.storage.entity.create<Group>({
			kind: EntityKind.Group,
			prop: [],
			...this.payload,
		});

		this.groupId = group.id;

		return group;
	}

	revert(): void {
		if (this.groupId) {
			this.storage.entity.delete(this.groupId);
		}
	}
}