export class EntityBuffer {
	private readonly gl: WebGL2RenderingContext;

	private texture: WebGLTexture | null = null;

	private readonly pixelsPerLayer = 2048;

	private readonly pixelsPerEntity = 4;

	private readonly bitsPerPixel = 4;

	private readonly floatsPerObject = this.pixelsPerEntity
		* this.bitsPerPixel;

	private readonly objectsPerLayer = this.pixelsPerLayer
		/ this.pixelsPerEntity;

	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
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
			this.pixelsPerLayer,
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

	fill(entities: {
		x: number;
		y: number;
		z: number;
		w: number;
		h: number;
		rotation: number;
	}[]): void {
		const gl = this.gl;
		if (entities.length === 0) return;

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);

		const data = new Float32Array(entities.length * this.floatsPerObject);

		for (let i = 0; i < entities.length; i++) {
			const object = entities[i];

			let cosR = Math.cos(object.rotation);
			let sinR = Math.sin(object.rotation);

			if (Math.abs(sinR) < 0.00001) sinR = 0.0;
			if (Math.abs(cosR - 1.0) < 0.00001) cosR = 1.0;
			if (Math.abs(cosR + 1.0) < 0.00001) cosR = -1.0;

			const offset = i * this.floatsPerObject;

			data[offset + 0] = cosR;
			data[offset + 1] = sinR;
			data[offset + 2] = 0.0;
			data[offset + 3] = object.w;

			data[offset + 4] = -sinR;
			data[offset + 5] = cosR;
			data[offset + 6] = 0.0;
			data[offset + 7] = object.h;

			data[offset + 8] = object.x;
			data[offset + 9] = object.y;
			data[offset + 10] = 1.0;
			data[offset + 11] = object.z;

			data[offset + 12] = 1.0;
			data[offset + 13] = 0.0;
			data[offset + 14] = 0.0;
			data[offset + 15] = 0.0;
		}

		const layersCount = Math.ceil(entities.length / this.objectsPerLayer);

		for (let layer = 0; layer < layersCount; layer++) {
			const entitiesDone = layer * this.objectsPerLayer;
			const entitiesLeft = entities.length - entitiesDone;
			const entitiesOnThisLayer = Math.min(
				this.objectsPerLayer,
				entitiesLeft
			);

			const widthInPixels = entitiesOnThisLayer * this.pixelsPerEntity;

			const srcFloatOffset = entitiesDone * this.floatsPerObject;

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
