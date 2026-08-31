import type {Adorner} from "@src/viewer/adorner";

export class AdornerPayload {
	private count = 0;

	private stride = 4;

	private MAX_INSTANCES = 1000;

	private buffer = new ArrayBuffer(this.stride * this.MAX_INSTANCES * 4);

	private float32Data = new Float32Array(this.buffer);
	private int32Data = new Int32Array(this.buffer);
	private uint32Data = new Uint32Array(this.buffer);

	clear(): void {
		this.count = 0;
		this.float32Data.fill(0);
	}

	add(data: Adorner): void {
		const offset = this.count * this.stride;

		this.float32Data[offset + 0] = data.x;
		this.float32Data[offset + 1] = data.y;

		this.int32Data[offset + 2] = data.kind;

		const r = Math.round(data.color.r * 255) & 0xFF;
		const g = Math.round(data.color.g * 255) & 0xFF;
		const b = Math.round(data.color.b * 255) & 0xFF;
		const a = Math.round(data.color.a * 255) & 0xFF;

		this.uint32Data[offset + 3] = a << 24 | b << 16 | g << 8 | r;

		this.count++;
	}

	getCount(): number {
		return this.count;
	}

	getData(): Float32Array {
		return this.float32Data.subarray(0, this.count * this.stride);
	}
}