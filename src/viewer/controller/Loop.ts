import type {Canvas, Overlay, View} from "@src/viewer/controller";

export class Loop {
	private isDirty = false;

	private updateId?: number;

	constructor(
		private view: View,
		private canvas: Canvas,
		private overlay: Overlay
	) {}

	requestUpdate(): void {
		this.isDirty = true;
		if (!this.updateId) {
			this.updateId = requestAnimationFrame(() => this.tick());
		}
	}

	private updateView(): boolean {
		const now = performance.now();

		const deltaX = this.view.xTween.update(now);
		const deltaY = this.view.yTween.update(now);
		const deltaS = this.view.sTween.update(now);

		return deltaX == 1 && deltaY == 1 && deltaS == 1;
	}

	private tick(): void {
		const isAllDone = this.updateView();

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
		this.canvas.draw();
		this.overlay.foo();
	}
}
