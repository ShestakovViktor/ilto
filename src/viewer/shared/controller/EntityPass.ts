import entityVertexShader from "@src/viewer/shared/shader/entity.vert.glsl";
import entityFragmentShader from "@src/viewer/shared/shader/entity.frag.glsl";
import type {
	TextureAtlas,
	ShaderCompiler,
	EntityPayload,
	TilePayload,
} from "@src/viewer/shared/controller";
import {BindingPoint} from "@src/viewer/shared/enum";

export class EntityPass {
	private program: WebGLProgram;
	private instanceBuffer: WebGLBuffer;
	private quadBuffer: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	private STRIDE = 9 * 4; // 36 байт

	private uTileSizeLoc!: WebGLUniformLocation | null;
	private uTextureArrayLoc!: WebGLUniformLocation | null;
	private uEntityMatrixArrayLoc!: WebGLUniformLocation | null;

	constructor(
		private readonly gl: WebGL2RenderingContext,
		compiler: ShaderCompiler,

		private tileSize: number
	) {
		this.program = compiler.compile(
			entityVertexShader,
			entityFragmentShader
		);

		this.bindUniformBlocks();
		this.bindUniformLocations();

		this.instanceBuffer = this.initInstanceBuffer();
		this.quadBuffer = this.initQuadBuffer();
		this.vao = this.initVAO();
	}

	private bindUniformBlocks(): void {
		const sharedBlockIndex = this.gl
			.getUniformBlockIndex(this.program, "SharedBuffer");

		if (sharedBlockIndex !== this.gl.INVALID_INDEX) {
			this.gl.uniformBlockBinding(
				this.program,
				sharedBlockIndex,
				BindingPoint.Shared
			);
		}
	}

	private bindUniformLocations(): void {
		const gl = this.gl;
		const program = this.program;

		this.uTileSizeLoc = gl
			.getUniformLocation(program, "u_tileSize");
		this.uTextureArrayLoc = gl
			.getUniformLocation(program, "u_textureArray");
		this.uEntityMatrixArrayLoc = gl
			.getUniformLocation(program, "u_entityMatrixArray");
	}

	private initInstanceBuffer(): WebGLBuffer {
		return this.gl.createBuffer();
	}

	private initQuadBuffer(): WebGLBuffer {
		const gl = this.gl;

		const quadBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
			gl.STATIC_DRAW
		);

		return quadBuffer;
	}

	private initVAO(): WebGLVertexArrayObject {

		const gl = this.gl;
		const program = this.program;
		const vao = gl.createVertexArray();

		gl.bindVertexArray(vao);

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

		gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
		const aQuadVertex = gl.getAttribLocation(program, "a_quadVertex");
		if (aQuadVertex !== -1) {
			gl.enableVertexAttribArray(aQuadVertex);
			gl.vertexAttribPointer(aQuadVertex, 2, gl.FLOAT, false, 0, 0);
			gl.vertexAttribDivisor(aQuadVertex, 0);
		}

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		return vao;
	}

	render(
		textureAtlas: TextureAtlas,
		entityPayload: EntityPayload,
		tilePayload: TilePayload
	): void {
		if (tilePayload.totalTilesCount === 0) return;

		const gl = this.gl;

		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, tilePayload.getData(), gl.STREAM_DRAW);

		gl.bindVertexArray(this.vao);

		this.setTexture(textureAtlas, entityPayload);
		this.setUniforms();

		gl.drawArraysInstanced(
			gl.TRIANGLE_STRIP,
			0,
			4,
			tilePayload.totalTilesCount
		);

		gl.bindVertexArray(null);
	}

	private setTexture(
		textureAtlas: TextureAtlas,
		entityPayload: EntityPayload
	): void {
		const gl = this.gl;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, textureAtlas.getData());

		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, entityPayload.getData());
	}

	private setUniforms(): void {
		const gl = this.gl;

		gl.uniform1f(this.uTileSizeLoc, this.tileSize);
		gl.uniform1i(this.uTextureArrayLoc, 0);
		gl.uniform1i(this.uEntityMatrixArrayLoc, 1);
	}
}