import type {Canvas, Viewport} from "@src/viewer/controller";

export class Loop {
	private isDirty = false;

	private updateId?: number;

	constructor(private viewport: Viewport, private canvas: Canvas) {}

	requestUpdate(): void {
		this.isDirty = true;
		if (!this.updateId) {
			this.updateId = requestAnimationFrame(() => this.tick());
		}
	}

	private updateViewport(now: number): boolean {
		const deltaX = this.viewport.x.update(now);
		const deltaY = this.viewport.y.update(now);
		const deltaS = this.viewport.s.update(now);

		return deltaX == 1 && deltaY == 1 && deltaS == 1;
	}

	private tick(): void {
		const now = performance.now();

		const isAllDone = this.updateViewport(now);

		if (!isAllDone) {
			this.isDirty = true;
		}

		if (this.isDirty) {
			this.isDirty = false;
			this.render();
		}

		if (!isAllDone) {
			this.updateId = requestAnimationFrame(() => this.tick());
		}
		else {
			this.updateId = undefined;
		}
	}

	private render(): void {
		this.canvas.draw(
			this.viewport.x.value,
			this.viewport.y.value,
			this.viewport.s.value
		);
	}
}
