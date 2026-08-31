import {type ActionEngine, InputMode} from "@src/editor/controller";
import type {Session} from "@src/editor/type";
import type {Viewer} from "@src/viewer/Viewer";
import {DraftPositionSetScript} from "@src/editor/script";

export class EntityCreateMode extends InputMode {
	constructor(
		private viewer: Viewer,
		private engine: ActionEngine,
		private session: Session
	) {
		super();
	}

	async foo(x: number, y: number): Promise<void> {
		if (
			"parentId" in this.session.draft
			&& "x" in this.session.draft
			&& "y" in this.session.draft
		) {
			await this.engine.apply(
				new DraftPositionSetScript(
					this.viewer,
					this.session,
					{x, y}
				)
			);

		}
	}

	onMouseDown(event: MouseEvent): void {
		const rect = (event.currentTarget as HTMLDivElement)
			.getBoundingClientRect();

		const x = Math.floor((event.x - rect.x - this.viewer.view.x)
            / this.viewer.view.s);
		const y = Math.floor((event.y - rect.y - this.viewer.view.y)
            / this.viewer.view.s);

		void this.foo(x, y);

		event.preventDefault();
	}

	onMouseMove(): void {}

	onMouseUp(): void {}
}