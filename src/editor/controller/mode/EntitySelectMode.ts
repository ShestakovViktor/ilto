import {type ActionEngine, Mode} from "@src/editor/controller";
import type {Entity} from "@src/core/type/entity";
import type {Spatial} from "@src/core/type/property";
import type {DataStorage} from "@src/core/controller";
import type {View} from "@src/viewer/controller";

export class EntitySelectMode extends Mode {

	constructor(
		private storage: DataStorage,
		private engine: ActionEngine,
		private view: View
	) {
		super();
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

		event.stopPropagation();
	}

	onMouseMove(event: MouseEvent): void {
		if (event.buttons != 1) return;

		event.stopPropagation();
	}

	onMouseUp(): void {
	}
}