import {Mode} from "@src/editor/controller";
import {ActivityKind, InputKind} from "@src/editor/enum";
import type {View} from "@src/viewer/controller";
import type {Session} from "@src/editor/type";

export class EntityCreateMode extends Mode {
	constructor(
		private view: View,
		private session: Session
	) {
		super();
	}

	onMouseDown(event: MouseEvent): void {
		const rect = (event.currentTarget as HTMLDivElement)
			.getBoundingClientRect();

		const x = Math.floor((event.x - rect.x)
            / this.view.s);
		const y = Math.floor((event.y - rect.y)
            / this.view.s);

		if (
			this.session.input == InputKind.ImageCreate
		) {
			this.session.activity = {
				kind: ActivityKind.ImageCreate,
				payload: {
					x,
					y,
					width: 0,
					height: 0,
					file: undefined,
					tile: false,
					pivotX: 0,
					pivotY: 0,
				},
			};
		}
		else if (this.session.input == InputKind.MarkerCreate) {
			this.session.activity = {
				kind: ActivityKind.MarkerCreate,
				payload: {x, y, width: 0, height: 0, file: undefined},
			};
		}

		event.preventDefault();
	}

	onMouseMove(): void {}

	onMouseUp(): void {}
}