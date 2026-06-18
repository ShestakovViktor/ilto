import {Tween} from "@src/viewer/controller";

export class Viewport {
	public frame = {x: 0, y: 0, w: 0, h: 0};

	public canvas = {x: 0, y: 0, w: 0, h: 0};

	public x = new Tween(0);

	public y = new Tween(0);

	public s = new Tween(1);

	public setFrame(rect: {x: number; y: number; w: number; h: number}): void {
		this.frame = rect;
	}

	public setCanvas(rect: {x: number; y: number; w: number; h: number}): void {
		this.canvas = rect;
	}

	public constrain(): void {
		const deltaX = this.frame.w - this.canvas.w * this.s.value;
		const minX = Math.min(deltaX, 0);
		const maxX = Math.max(deltaX, 0);
		this.applyBounce(this.x, minX, maxX);

		const deltaY = this.frame.h - this.canvas.h * this.s.value;
		const minY = Math.min(deltaY, 0);
		const maxY = Math.max(deltaY, 0);
		this.applyBounce(this.y, minY, maxY);
	}

	private applyBounce(
		tween: Tween,
		min: number,
		max: number
	): void {
		if (tween.dest < min || tween.dest > max) {
			const safeDest = tween.dest < min ? min : max;

			tween.set(safeDest, tween.time, tween.span, "outBack");
		}
	}
}
