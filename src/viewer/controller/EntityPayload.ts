import type {EntityConfig} from "@src/viewer/type";

export class EntityPayload {
	private texture: WebGLTexture | null = null;

	private readonly floatsPerLayer: number;

	private readonly objectsPerLayer: number;

	constructor(
		private readonly entityConfig: EntityConfig,
		private readonly gl: WebGL2RenderingContext
	) {
		this.floatsPerLayer = this.entityConfig.size
			* this.entityConfig.slots;
		this.objectsPerLayer = this.floatsPerLayer
			/ this.entityConfig.stride;

		this.init();
	}

	private init(): void {
		const gl = this.gl;
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);

		gl.texStorage3D(
			gl.TEXTURE_2D_ARRAY,
			1,
			gl.RGBA32F,
			this.entityConfig.size,
			1,
			64
		);

		gl.texParameteri(
			gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_MIN_FILTER,
			gl.NEAREST
		);

		gl.texParameteri(
			gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_MAG_FILTER,
			gl.NEAREST
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

	fill(data: Float32Array): void {
		const gl = this.gl;

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);

		const entitesCount = data.length / this.entityConfig.stride;
		const layersCount = Math.ceil(entitesCount / this.objectsPerLayer);

		for (let layer = 0; layer < layersCount; layer++) {
			const entitiesDone = layer * this.objectsPerLayer;
			const entitiesLeft = entitesCount - entitiesDone;
			const entitiesOnThisLayer = Math.min(
				this.objectsPerLayer,
				entitiesLeft
			);

			const widthInPixels = entitiesOnThisLayer
				* this.entityConfig.stride
				/ this.entityConfig.slots;

			const srcFloatOffset = entitiesDone
				* this.entityConfig.stride;

			gl.texSubImage3D(
				gl.TEXTURE_2D_ARRAY,
				0,
				0, 0, layer,
				widthInPixels, 1, 1,
				gl.RGBA,
				gl.FLOAT,
				data,
				srcFloatOffset
			);
		}
	}

	getData(): WebGLTexture | null {
		return this.texture;
	}
}
