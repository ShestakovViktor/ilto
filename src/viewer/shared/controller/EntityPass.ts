import entityVertexShader from "@src/viewer/shared/shader/entity.vert.glsl";
import entityFragmentShader from "@src/viewer/shared/shader/entity.frag.glsl";
import {
	type TextureAtlas,
	type ShaderCompiler,
	type EntityPayload,
	type TilePayload,
	RenderPass,
	type Attribute,
} from "@src/viewer/shared/controller";
import {BindingPoint, UniformBlock} from "@src/viewer/shared/enum";

export class EntityPass extends RenderPass {
	protected program: WebGLProgram;
	private instanceBuffer: WebGLBuffer;
	private quadBuffer: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	private stride = 9 * 4; // 36 байт
	private divisor = 1;

	private uTileSizeLoc!: WebGLUniformLocation | null;
	private uTextureArrayLoc!: WebGLUniformLocation | null;
	private uEntityMatrixArrayLoc!: WebGLUniformLocation | null;

	protected get attributes(): Attribute[] {
		const gl = this.gl;
		return [
			{
				name: "a_tileGrid",
				location: 1,
				size: 2,
				type: gl.FLOAT,
				normalized: false,
				offset: 0,
			},
			{
				name: "a_tileUvMin",
				location: 2,
				size: 2,
				type: gl.FLOAT,
				normalized: false,
				offset: 2 * 4,
			},
			{
				name: "a_tileUvMax",
				location: 3,
				size: 2,
				type: gl.FLOAT,
				normalized: false,
				offset: 4 * 4,
			},
			{
				name: "a_tileLayer",
				location: 4,
				size: 1,
				type: gl.FLOAT,
				normalized: false,
				offset: 6 * 4,
			},
			{
				name: "a_entityMatrixIndex",
				location: 5,
				size: 1,
				type: gl.FLOAT,
				normalized: false,
				offset: 7 * 4,
			},
			{
				name: "a_entityMatrixLayer",
				location: 6,
				size: 1,
				type: gl.FLOAT,
				normalized: false,
				offset: 8 * 4,
			},
		];
	}

	constructor(
		protected readonly gl: WebGL2RenderingContext,
		compiler: ShaderCompiler,

		private tileSize: number
	) {
		super(gl);

		this.program = compiler.compile(
			entityVertexShader,
			entityFragmentShader
		);

		this.bindUniformBlocks();
		this.getUniformLocations();

		this.instanceBuffer = this.initInstanceBuffer();
		this.quadBuffer = this.initQuadBuffer();
		this.vao = this.initVAO();
	}

	private bindUniformBlocks() {
		this.bindUniformBlock(
			this.program,
			UniformBlock.Shared,
			BindingPoint.Shared
		);
	}

	private getUniformLocations(): void {
		this.uTileSizeLoc = this
			.getUniformLocation("u_tileSize");
		this.uTextureArrayLoc = this
			.getUniformLocation("u_textureArray");
		this.uEntityMatrixArrayLoc = this
			.getUniformLocation("u_entityMatrixArray");
	}

	private initVAO(): WebGLVertexArrayObject {
		const gl = this.gl;
		const vao = gl.createVertexArray();

		gl.bindVertexArray(vao);

		this.bindQuadBuffer(
			this.quadBuffer
		);

		this.bindInstanceBuffer(
			this.instanceBuffer,
			this.attributes,
			this.stride,
			this.divisor
		);

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
		this.bindUniforms();

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

	private bindUniforms(): void {
		const gl = this.gl;

		gl.uniform1f(this.uTileSizeLoc, this.tileSize);
		gl.uniform1i(this.uTextureArrayLoc, 0);
		gl.uniform1i(this.uEntityMatrixArrayLoc, 1);
	}
}