export interface OutlineElement {
	x: number;
	y: number;
	width: number;
	height: number;
	thickness: number;
	color: {r: number; g: number; b: number; a: number};
}

export class OutlinePayload {
	private count = 0;
	private stride = 6; // Убрали a_segment_type (теперь 6 float/int)
	private MAX_ELEMENTS = 1000;

	private buffer = new ArrayBuffer(this.stride * this.MAX_ELEMENTS * 4);
	private float32Data = new Float32Array(this.buffer);
	private uint32Data = new Uint32Array(this.buffer);

	clear(): void {
		this.count = 0;
		this.float32Data.fill(0);
	}

	add(element: OutlineElement): void {
		if (this.count >= this.MAX_ELEMENTS) return;

		const offset = this.count * this.stride;

		// 1 инстанс = 1 элемент целиком
		this.float32Data[offset + 0] = element.x;
		this.float32Data[offset + 1] = element.y;
		this.float32Data[offset + 2] = element.width;
		this.float32Data[offset + 3] = element.height;
		this.float32Data[offset + 4] = element.thickness;

		const r = Math.round(element.color.r * 255) & 0xFF;
		const g = Math.round(element.color.g * 255) & 0xFF;
		const b = Math.round(element.color.b * 255) & 0xFF;
		const a = Math.round(element.color.a * 255) & 0xFF;
		this.uint32Data[offset + 5] = a << 24 | b << 16 | g << 8 | r;

		this.count++;
	}

	getCount(): number {
		return this.count;
	}

	getData(): Float32Array {
		return this.float32Data.subarray(0, this.count * this.stride);
	}
}
