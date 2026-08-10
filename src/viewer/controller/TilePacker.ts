import type {TextureLayout, TileConfig} from "@src/viewer/type";

export class TilePacker {
	constructor(private readonly tileConfig: TileConfig) {}

	formData(objects: TextureLayout[]): {data: Float32Array; count: number} {
		let totalTilesCount = 0;

		for (const obj of objects) {
			totalTilesCount += obj.tiles.length;
		}

		const data = new Float32Array(totalTilesCount * this.tileConfig.stride);

		let offset = 0;

		for (let i = 0; i < objects.length; i++) {
			const layout = objects[i];

			const matrixLayer = Math.floor(i / 512);
			const objectIdInLayer = i % 512;

			for (let r = 0; r < layout.rows; r++) {
				for (let c = 0; c < layout.columns; c++) {
					const tileIndex = r * layout.columns + c;
					const textureTile = layout.tiles[tileIndex];

					data[offset + 0] = c;
					data[offset + 1] = r;
					data[offset + 2] = textureTile.uMin;
					data[offset + 3] = textureTile.vMin;
					data[offset + 4] = textureTile.uMax;
					data[offset + 5] = textureTile.vMax;
					data[offset + 6] = textureTile.layer;
					data[offset + 7] = objectIdInLayer;
					data[offset + 8] = matrixLayer;

					offset += this.tileConfig.stride;
				}
			}
		}

		return {data, count: totalTilesCount};
	}
}
