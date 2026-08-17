import {type ActionEngine, Mode} from "@src/editor/controller";
import type {Entity} from "@src/core/type/entity";
import {isSpatial, type Spatial} from "@src/core/type/property";
import {MoveEntityAction} from "@src/editor/action";
import type {DataStorage} from "@src/core/controller";
import type {ViewerState} from "@src/viewer/type";
import type {Getter} from "@src/editor/type";

export class EntitySelect extends Mode {
	private element?: HTMLElement;

	private entity?: Entity & Spatial;

	private parent?: {x: number; y: number};

	private offset?: {x: number; y: number};

	private origin?: {x: number; y: number};

	private allowedTypes: number[];

	constructor(
		private getViewer: Getter<ViewerState>,
		private storage: DataStorage,
		private engine: ActionEngine
	) {
		super();
		// const [markerType] = this.databse.entityType
		//     .filter({name: ENTITY_TYPE.MARKER});
		// const [decorType] = this.databse.entityType
		//     .filter({name: ENTITY_TYPE.DECOR});
		// const [areaType] = this.databse.entityType
		//     .filter({name: ENTITY_TYPE.AREA});

		this.allowedTypes = [];
	}

	getElement(element: EventTarget | null): HTMLElement | undefined {
		if (!(element instanceof HTMLElement)) return undefined;

		let current: HTMLElement | null = element;

		while (current) {
			if (current.hasAttribute("data-entity-id")) return current;
			current = current.parentElement;
		}

		return undefined;
	}

	getParent(element: HTMLElement): {x: number; y: number} {
		const parent = element.parentElement;
		if (!parent) throw new Error();

		const rect = parent.getBoundingClientRect();

		return {x: rect.x, y: rect.y};
	}

	getEntity(element: HTMLElement): Entity & Spatial {
		const entity = this.storage.entity.select(
			Number(element.getAttribute("data-entity-id"))
		);

		if (!entity || !isSpatial(entity)) throw new Error();

		return entity;
	}

	getOffset(element: HTMLElement, event: MouseEvent): {x: number; y: number} {
		const rect = element.getBoundingClientRect();

		return {
			x: event.x - rect.x,
			y: event.y - rect.y,
		};
	}

	getStart(entity: Entity & Spatial): {x: number; y: number} {
		return {x: entity.x, y: entity.y};
	}

	onMouseDown(event: MouseEvent): void {
		if (event.buttons != 1) return;

		this.element = this.getElement(event.target);
		if (!this.element) throw new Error();

		this.parent = this.getParent(this.element);
		if (!this.parent) throw new Error();

		this.entity = this.getEntity(this.element);

		this.offset = this.getOffset(this.element, event);

		this.origin = this.getStart(this.entity);

		event.stopPropagation();
	}

	onMouseMove(event: MouseEvent): void {
		if (!this.entity || !this.parent || !this.offset) return;

		this.storage.entity.update<Entity & Spatial>(this.entity?.id, {
			x: Math.round(
				(event.x - this.parent.x - this.offset.x)
                                / this.getViewer().scale
			),
			y: Math.round(
				(event.y - this.parent.y - this.offset.y)
                                / this.getViewer().scale
			),
		});

		event.stopPropagation();
	}

	onMouseUp(): void {
		if (this.entity && this.origin) {
			this.engine.append(
				new MoveEntityAction(
					this.storage,
					this.entity.id,
					this.entity.x - this.origin.x,
					this.entity.y - this.origin.y
				)
			);
		}

		delete this.element;
		delete this.entity;
		delete this.parent;
		delete this.offset;
	}
}