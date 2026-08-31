import {Action} from "@src/shared/controller";
import type {DataRepository} from "@src/storage/controller";
import type {Group} from "@src/storage/type/entity";
import {EntityKind} from "@src/storage/enum";

export class ProjectInitAction extends Action {
	name = "ProjectInitAction";

	constructor(
		private storage: DataRepository,
		public payload: {
			name: string;
			width: number;
			height: number;
		}
	) {
		super();
	}

	apply(): void {
		this.storage.initData(this.payload);

		this.storage.entity.insert<Group>({
			id: 1,
			kind: EntityKind.Group,
			prop: [],
			childIds: [],
			x: 0,
			y: 0,
			rotation: 0,
			scaleX: 1,
			scaleY: 1,
			name: "",
		});
	}

	revert(): void {}
}