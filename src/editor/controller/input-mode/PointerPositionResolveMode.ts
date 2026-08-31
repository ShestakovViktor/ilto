import type {Viewer} from "@src/viewer/Viewer";
import {InputResolveMode} from "./InputResolveMode";

export class PointerPositionResolveMode
	extends InputResolveMode<{x: number; y: number}> {

	constructor(
		private viewer: Viewer,
		resolve: (data: {x: number; y: number}) => void | Promise<void>
	) {
		super(resolve);
	}

	onMouseDown(event: MouseEvent): void {
		const rect = (event.currentTarget as HTMLDivElement)
			.getBoundingClientRect();

		const x = Math.floor((event.x - rect.x - this.viewer.view.x)
            / this.viewer.view.s);
		const y = Math.floor((event.y - rect.y - this.viewer.view.y)
            / this.viewer.view.s);

		this.resolve({x, y}).catch((error) => {
			if (this.release) this.release();
			throw error;
		});

		event.preventDefault();
	}

	onMouseMove(): void {}

	onMouseUp(): void {}
}