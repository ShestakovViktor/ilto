import {type Engine, Mode} from "@src/editor/controller";
import {ActivityKind, InputMode} from "@src/editor/enum";
import type {Getter, Session, Setter} from "@src/editor/type";
import type {ViewerState} from "@src/viewer/type";
import type {Storage} from "@src/core/controller";
import type {GraphicsDriver} from "@src/core/interface";
import type {Loop} from "@src/viewer/controller";

export class EntityCreateMode extends Mode {
	constructor(
		private getViewer: Getter<ViewerState>,
		private setSession: Setter<Session>,
		private graphics: GraphicsDriver,
		private storage: Storage,
		private loop: Loop,
		private engine: Engine
	) {
		super();
	}

	onMouseDown(event: MouseEvent): void {
		const rect = (event.currentTarget as HTMLDivElement)
			.getBoundingClientRect();

		const x = Math.floor((event.x - rect.x)
            / this.getViewer().scale);
		const y = Math.floor((event.y - rect.y)
            / this.getViewer().scale);

		this.setSession((prev) => {
			if (
				prev.inputMode == InputMode.ImageCreate
			) {
				this.setSession({activity: {
					kind: ActivityKind.ImageCreate,
					payload: {x, y, width: 0, height: 0, file: undefined},
				}});
			}
			else if (
				prev.inputMode == InputMode.MarkerCreate
			){
				this.setSession({activity: {
					kind: ActivityKind.MarkerCreate,
					payload: {x, y, width: 0, height: 0, file: undefined},
				}});
			}
		});

		event.preventDefault();
	}

	onMouseMove(): void {}

	onMouseUp(): void {}
}