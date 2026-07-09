import entityVertexShader from "@src/viewer/shader/entity.vert.glsl";
import entityFragmentShader from "@src/viewer/shader/entity.frag.glsl";
import type {TextureBuffer, Compiler, EntityBuffer, TileBuffer} from "@src/viewer/controller";

export class EntityPass {
	private program: WebGLProgram;

	private instanceBuffer: WebGLBuffer;

	private quadBuffer: WebGLBuffer;

	private vao: WebGLVertexArrayObject;

	private STRIDE = 9 * 4; // 36 байт

	private uTileSizeLoc: WebGLUniformLocation | null;

	private uTextureArrayLoc: WebGLUniformLocation | null;

	private uEntityMatrixArrayLoc: WebGLUniformLocation | null;

	private uProjectionMatrixLoc: WebGLUniformLocation | null;

	private uViewMatrixLoc: WebGLUniformLocation | null;

	constructor(
		private readonly gl: WebGL2RenderingContext,
		compiler: Compiler,
		private tileSize: number
	) {
		this.program = compiler.compile(
			entityVertexShader,
			entityFragmentShader
		);

		this.instanceBuffer = this.gl.createBuffer()!;
		this.quadBuffer = this.gl.createBuffer()!;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
			this.gl.STATIC_DRAW
		);

		this.uTileSizeLoc = this.gl
			.getUniformLocation(this.program, "u_tileSize");
		this.uTextureArrayLoc = this.gl
			.getUniformLocation(this.program, "u_textureArray");
		this.uEntityMatrixArrayLoc = this.gl
			.getUniformLocation(this.program, "u_entityMatrixArray");
		this.uProjectionMatrixLoc = this.gl
			.getUniformLocation(this.program, "u_projectionMatrix");
		this.uViewMatrixLoc = this.gl
			.getUniformLocation(this.program, "u_viewMatrix");

		this.vao = this.gl.createVertexArray()!;
		this.setupVAO();
	}

	private setupVAO(): void {
		const gl = this.gl;
		const program = this.program;

		gl.bindVertexArray(this.vao);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
		const attributes = [
			{name: "a_tileGrid", size: 2, offset: 0},
			{name: "a_tileUvMin", size: 2, offset: 2 * 4},
			{name: "a_tileUvMax", size: 2, offset: 4 * 4},
			{name: "a_tileLayer", size: 1, offset: 6 * 4},
			{name: "a_entityMatrixIndex", size: 1, offset: 7 * 4},
			{name: "a_entityMatrixLayer", size: 1, offset: 8 * 4},
		];

		for (const attribute of attributes) {
			const location = gl.getAttribLocation(program, attribute.name);
			if (location !== -1) {
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(
					location,
					attribute.size,
					gl.FLOAT,
					false,
					this.STRIDE,
					attribute.offset
				);
				gl.vertexAttribDivisor(location, 1);
			}
		}

		// Связываем буфер геометрии квада с его атрибутом внутри VAO
		gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
		const aQuadVertex = gl.getAttribLocation(program, "a_quadVertex");
		if (aQuadVertex !== -1) {
			gl.enableVertexAttribArray(aQuadVertex);
			gl.vertexAttribPointer(aQuadVertex, 2, gl.FLOAT, false, 0, 0);
			gl.vertexAttribDivisor(aQuadVertex, 0); // Повторяется для каждого квада
		}

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
	}

	render(
		projMatrix: Float32Array,
		viewMatrix: Float32Array,
		atlas: TextureBuffer,
		entityBuffer: EntityBuffer,
		tileBuffer: TileBuffer
	): void {
		if (tileBuffer.totalTilesCount === 0) return;

		const gl = this.gl;

		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, tileBuffer.getData(), gl.STREAM_DRAW);

		gl.bindVertexArray(this.vao);

		this.setTexture(atlas, entityBuffer);
		this.setUniforms(projMatrix, viewMatrix);

		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArraysInstanced(
			gl.TRIANGLE_STRIP,
			0,
			4,
			tileBuffer.totalTilesCount
		);

		gl.bindVertexArray(null);
	}

	private setTexture(atlas: TextureBuffer, entityBuffer: EntityBuffer): void {
		const gl = this.gl;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, atlas.getData());

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, entityBuffer.getData());
	}

	private setUniforms(
		projMatrix: Float32Array,
		viewMatrix: Float32Array
	): void {
		const gl = this.gl;

		gl.uniform1f(this.uTileSizeLoc, this.tileSize);
		gl.uniform1i(this.uTextureArrayLoc, 0);
		gl.uniform1i(this.uEntityMatrixArrayLoc, 1);
		gl.uniformMatrix3fv(this.uProjectionMatrixLoc, false, projMatrix);
		gl.uniformMatrix3fv(this.uViewMatrixLoc, false, viewMatrix);
	}
}