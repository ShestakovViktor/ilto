export class Frame {

	x = 0;

	y = 0;

	w = 0;

	h = 0;

	setSize(x: number, y: number, w: number, h: number): void {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	getProjMatrix(): Float32Array {
		return new Float32Array([
			2 / this.w, 0, 0,
			0, -2 / this.h, 0,
			-1, 1, 1,
		]);
	}
}