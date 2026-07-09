import {type Scene, Tween, type Canvas, type Frame} from "@src/viewer/controller";

export class View {
	xTween = new Tween(0);

	yTween = new Tween(0);

	sTween = new Tween(1);

	get x(): number {
		return this.xTween.value;
	}

	get y(): number {
		return this.yTween.value;
	}

	get s(): number {
		return this.sTween.value;
	}

	constrain(frame: Frame, scene: Scene): void {
		const deltaX = frame.w - scene.w * this.sTween.value;
		const minX = Math.min(deltaX, 0);
		const maxX = Math.max(deltaX, 0);
		this.applyBounce(this.xTween, minX, maxX);

		const deltaY = frame.h - scene.h * this.sTween.value;
		const minY = Math.min(deltaY, 0);
		const maxY = Math.max(deltaY, 0);
		this.applyBounce(this.yTween, minY, maxY);
	}

	getViewMatrix(): Float32Array {
		return new Float32Array([
			this.s, 0, 0,
			0, this.s, 0,
			Math.round(this.x), Math.round(this.y), 1,
		]);
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