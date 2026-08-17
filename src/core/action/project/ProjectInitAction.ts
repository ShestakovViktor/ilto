import {Action} from "@src/core/library";
import type {DataStorage} from "@src/core/controller";
import type {Group} from "@src/core/type/entity";
import {EntityKind} from "@src/core/enum";

export class ProjectInitAction extends Action {
	name = "ProjectInitAction";

	constructor(
		private storage: DataStorage,
		public payload: {
			name: string;
			width: number;
			height: number;
		}
	) {
		super();
	}

	exec(): void {
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

	undo(): void {}
}