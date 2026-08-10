import type {
	TextureConfig,
	TextureLayout,
	TextureTile,
	TileConfig,
	ImageLayout,
	ImageTile,
} from "@src/viewer/type";

export class TextureAtlas {
	private readonly tilesPerRow: number;

	private readonly tilesPerLayer: number;

	private readonly tilesPerAtlas: number;

	private textureArray: WebGLTexture | null = null;

	private registry: Map<number, TextureLayout> = new Map();

	private freeTiles: number[] = [];

	constructor(
		private gl: WebGL2RenderingContext,
		private textureConfig: TextureConfig,
		private tileConfig: TileConfig
	) {
		this.gl = gl;
		this.tilesPerRow = this.textureConfig.size / this.tileConfig.dst;
		this.tilesPerLayer = this.tilesPerRow * this.tilesPerRow;
		this.tilesPerAtlas = this.tilesPerLayer * this.textureConfig.depth;

		this.fillFreeIndexes();
		this.initTextureArray();
	}

	private fillFreeIndexes(): void {
		for (let i = this.tilesPerAtlas - 1; i >= 0; i--) {
			this.freeTiles.push(i);
		}
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
		textureId: number,
		imageLayout: ImageLayout,
		imageTiles: ImageTile[]
	): TextureLayout {
		const gl = this.gl;
		const textureTiles: TextureTile[] = [];

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.textureArray);

		for (const tile of imageTiles) {
			const index = this.freeTiles.pop();

			if (index == undefined) throw new Error(index);

			const layer = Math
				.floor(index / this.tilesPerLayer);

			const tileIndex = index % this.tilesPerLayer;

			const tileColumn = tileIndex % this.tilesPerRow;
			const tileRow = Math.floor(tileIndex / this.tilesPerRow);

			const tileX = tileColumn * this.tileConfig.dst;
			const tileY = tileRow * this.tileConfig.dst;

			gl.texSubImage3D(
				gl.TEXTURE_2D_ARRAY,
				0,
				tileX,
				tileY,
				layer,
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
				layer,
				index,
			});
		}

		const textureLayout: TextureLayout = {
			textureId,
			createTime: Date.now(),
			accessTime: Date.now(),
			columns: imageLayout.columns,
			rows: imageLayout.rows,
			tiles: textureTiles,

		};

		this.registry.set(textureId, textureLayout);

		return textureLayout;
	}

	checkTextureLayout(textureId: number): boolean {
		return this.registry.has(textureId);
	}

	getTextureLayout(textureId: number): TextureLayout {
		const texture = this.registry.get(textureId);

		if (!texture) throw new Error();
		else {
			texture.accessTime = Date.now();
		}

		return texture;
	}

	delTextureLayout(textureId: number): boolean {
		const layout = this.registry.get(textureId);
		if (!layout) return false;

		for (const tile of layout.tiles) {
			this.freeTiles.push(tile.index);
		}

		this.registry.delete(textureId);
		return true;
	}

	getData(): WebGLTexture | null { return this.textureArray; }
}