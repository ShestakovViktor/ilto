import {CreateImageScript} from "@src/editor/script/CreateImageScript";
import {type Engine, Mode} from "@src/editor/controller";
import {InputMode, ModalKind} from "@src/editor/enum";
import type {Getter, Session, Setter} from "@src/editor/type";
import type {ViewerState} from "@src/viewer/type";
import type {Storage} from "@src/core/controller";
import type {GraphicsDriver} from "@src/core/interface";
import type {Loop} from "@src/viewer/controller";

export class EntityCreate extends Mode {
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
			if (prev.inputMode == InputMode.ImageCreate) {
				prev.modal.push({
					kind: ModalKind.ImageForm,
					props: {
						x: 23,
						y,
						onSubmit: async (
							x: number,
							y: number,
							w: number,
							h: number,
							file: File
						) => {
							await this.engine.exec(new CreateImageScript(
								this.storage,
								this.graphics,
								{x, y, w, h, file}
							));
							this.loop.requestUpdate();

							this.setSession({inputMode: InputMode.DefaultView});
						},
					},
				});
			}
		});

		event.preventDefault();
	}

	onMouseMove(): void {}

	onMouseUp(): void {}
}