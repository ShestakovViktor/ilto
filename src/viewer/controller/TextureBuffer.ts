import type {TextureTile, TextureLayout, ImageLayout, ImageTile, TileConfig, TextureConfig} from "@src/viewer/type";

export class TextureBuffer {
	private readonly tilesPerRow: number;

	private readonly tilesPerLayer: number;

	private textureArray: WebGLTexture | null = null;

	private registry: Map<string, TextureLayout> = new Map();

	private nextFreeTileIndex = 0;

	constructor(
		private gl: WebGL2RenderingContext,
		private textureConfig: TextureConfig,
		private tileConfig: TileConfig
	) {
		this.gl = gl;
		this.tilesPerRow = this.textureConfig.size / this.tileConfig.dst;
		this.tilesPerLayer = this.tilesPerRow * this.tilesPerRow;

		this.initTextureArray();
	}

	private initTextureArray(): void {
		const gl = this.gl;
		if (this.textureArray) {
			gl.deleteTexture(this.textureArray);
		}

		this.textureArray = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.textureArray);

		gl.texStorage3D(
			gl.TEXTURE_2D_ARRAY,
			1,
			gl.RGBA8,
			this.textureConfig.size,
			this.textureConfig.size,
			this.textureConfig.depth
		);

		gl.texParameteri(
			gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_MIN_FILTER,
			gl.LINEAR
		);

		gl.texParameteri(
			gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_MAG_FILTER,
			gl.LINEAR
		);
		gl.texParameteri(
			gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_WRAP_S,
			gl.CLAMP_TO_EDGE
		);
		gl.texParameteri(
			gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_WRAP_T,
			gl.CLAMP_TO_EDGE
		);
	}

	uploadImage(
		assetId: string,
		imageLayout: ImageLayout,
		imageTiles: ImageTile[]
	): TextureLayout {
		const gl = this.gl;
		const textureTiles: TextureTile[] = [];

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.textureArray);

		for (const tile of imageTiles) {
			const layerIndex = Math
				.floor(this.nextFreeTileIndex / this.tilesPerLayer);

			const tileIndex = this.nextFreeTileIndex % this.tilesPerLayer;

			const tileColumn = tileIndex % this.tilesPerRow;
			const tileRow = Math.floor(tileIndex / this.tilesPerRow);

			const tileX = tileColumn * this.tileConfig.dst;
			const tileY = tileRow * this.tileConfig.dst;

			gl.texSubImage3D(
				gl.TEXTURE_2D_ARRAY,
				0,
				tileX,
				tileY,
				layerIndex,
				this.tileConfig.dst,
				this.tileConfig.dst,
				1,
				gl.RGBA,
				gl.UNSIGNED_BYTE,
				tile.bitmap
			);

			tile.bitmap.close();

			const usefulMinX = tileX + this.tileConfig.extrusion + this.tileConfig.spacing;
			const usefulMinY = tileY + this.tileConfig.extrusion + this.tileConfig.spacing;
			const usefulMaxX = usefulMinX + this.tileConfig.src;
			const usefulMaxY = usefulMinY + this.tileConfig.src;

			const uMin = usefulMinX / this.textureConfig.size;
			const vMin = usefulMinY / this.textureConfig.size;
			const uMax = usefulMaxX / this.textureConfig.size;
			const vMax = usefulMaxY / this.textureConfig.size;

			textureTiles.push({
				uMin,
				vMin,
				uMax,
				vMax,
				layerIndex,
			});

			this.nextFreeTileIndex++;
		}

		const textureLayout: TextureLayout = {
			assetId,
			columns: imageLayout.columns,
			rows: imageLayout.rows,
			tiles: textureTiles,
		};

		this.registry.set(assetId, textureLayout);

		return textureLayout;
	}

	getTextureLayout(assetId: string): TextureLayout | undefined {
		return this.registry.get(assetId);
	}

	getData(): WebGLTexture | null { return this.textureArray; }
}