import {EntityKind} from "@src/core/enum";
import {type ActionEngine, Mode} from "@src/editor/controller";
import type {Group, Decor} from "@src/core/type";
import type {Session} from "@src/editor/type";
import type {ViewerState} from "@src/viewer/type";
import type {SetStoreFunction} from "solid-js/store";
import type {Storage} from "@src/storage/controller";

export class DecorCreate extends Mode {

	constructor(
		private viewer: ViewerState,
		private editor: Session,
		private setEditor: SetStoreFunction<Session>,
		private engine: ActionEngine,
		private storage: Storage
	) {
		super();
	}

	onMouseDown(event: MouseEvent): void {
		const x = Math.floor(event.x /*- this.viewer.x*/ / this.viewer.scale);
		const y = Math.floor(event.y /*- this.viewer.y*/ / this.viewer.scale);

		const decor = this.initEntity(x, y);

		this.setEditor({
			selected: decor,
		});

		event.preventDefault();
	}

	initEntity(x: number, y: number): Decor {
		const parent = this.editor.layer;

		if (!parent) throw new Error();

		const decor = this.storage.entity.create<Decor>({
			kind: EntityKind.Decor,
			x,
			y,
			w: 64,
			h: 64,
			prop: [],
			propId: null,
			motionId: null,
		});

		this.storage.entity.update<Group>(
			parent.id,
			{childIds: [...parent.childIds, decor.id]}
		);

		return decor;
	}

	onMouseUp(): void {}

	onMouseMove(): void {}
}