export class TilePayload {
	data: Float32Array = new Float32Array();

	totalTilesCount = 0;

	getData(): Float32Array {
		return this.data;
	}

	fill(data: Float32Array, count: number): void {
		this.data = data;
		this.totalTilesCount = count;
	}
}
