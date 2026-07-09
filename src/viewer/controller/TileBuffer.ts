import type {TextureLayout} from "@src/viewer/type";

export class TileBuffer {
	private readonly floatsPerTile = 9;

	data: Float32Array = new Float32Array();

	totalTilesCount = 0;

	getData(): Float32Array {
		return this.data;
	}

	fill(objects: {textureLayout: TextureLayout}[]): void {
		this.totalTilesCount = 0;

		for (const obj of objects) {
			this.totalTilesCount += obj.textureLayout.tiles.length;
		}

		if (this.totalTilesCount === 0) {
			this.data = new Float32Array(0);
			return;
		}

		this.data = new Float32Array(this.totalTilesCount * this.floatsPerTile);
		let offset = 0;

		for (let i = 0; i < objects.length; i++) {
			const obj = objects[i];
			const layout = obj.textureLayout;

			const matrixLayer = Math.floor(i / 512);
			const objectIdInLayer = i % 512;

			for (let r = 0; r < layout.rows; r++) {
				for (let c = 0; c < layout.columns; c++) {
					const tileIndex = r * layout.columns + c;
					const textureTile = layout.tiles[tileIndex];

					this.data[offset + 0] = c;
					this.data[offset + 1] = r;
					this.data[offset + 2] = textureTile.uMin;
					this.data[offset + 3] = textureTile.vMin;
					this.data[offset + 4] = textureTile.uMax;
					this.data[offset + 5] = textureTile.vMax;
					this.data[offset + 6] = textureTile.layerIndex;
					this.data[offset + 7] = objectIdInLayer;
					this.data[offset + 8] = matrixLayer;

					offset += this.floatsPerTile;
				}
			}
		}
	}
}
