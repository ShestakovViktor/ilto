import {Mode, type ActionEngine} from "@src/editor/controller";
import type {Area} from "@src/core/type/entity/Area";
import type {Entity, Parent} from "@src/core/type";
import type {Footnote} from "@src/core/type/entity/Footnote";
import {EntityKind} from "@src/core/enum";
import type {Session} from "@src/editor/type";
import type {ViewerState} from "@src/viewer/type";
import type {DataStorage} from "@src/core/controller";

export class AreaCreate extends Mode {
	constructor(
		private viewer: ViewerState,
		private editor: Session,
		private engine: ActionEngine,
		private storage: DataStorage
	) {
		super();
	}

	initArea(x: number, y: number): Area {
		const parent = this.editor.layer;
		if (!parent) throw new Error();

		const area = this.storage.entity.create<Area>({
			kind: EntityKind.Area,
			x,
			y,
			width: 0,
			height: 0,
			points: [{x: 0, y: 0}],
			prop: [],
			footnoteId: null,
		});

		this.storage.entity.update<Entity & Parent>(
			parent.id,
			{childIds: [...parent.childIds, area.id]}
		);

		const footnote = this.storage.entity.create<Footnote>({
			kind: EntityKind.Footnote,
			text: "",
			prop: [],
		});

		this.storage.entity.update<Area>(
			area.id,
			{footnoteId: footnote.id}
		);

		return area;
	}

	onMouseDown(event: MouseEvent): void {
		event.stopPropagation();

		const x = Math.floor(event.x /*- this.viewer.x*/ / this.viewer.scale);
		const y = Math.floor(event.y /*- this.viewer.y*/ / this.viewer.scale);
		const click = {x, y};

		if (event.buttons == 1) {

			const selected = this.editor.selected;

			if (selected?.kind != EntityKind.Area) {
				// this.setEditor({selected: this.initArea(x, y)});
			}
			else {
				const area = selected as Area;

				// const res = pushAreaPoint(area, click);

				// this.storage.entity.update<Area>(area.id, res);
			}

			// editorContext.setState({toolkit: {items: [TOOLKIT_MODE.ENTITY_FORM]}});

			event.preventDefault();
		}
		else if (event.buttons == 2) {
			// this.setEditor({selected: undefined});
		}
	}

	onMouseMove(event: PointerEvent): void {
		event.stopPropagation();
	}

	onMouseUp(): void {}
}