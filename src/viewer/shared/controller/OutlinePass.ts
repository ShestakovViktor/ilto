import frameVertexShader from "@src/viewer/shader/frame.vert.glsl";
import frameFragmentShader from "@src/viewer/shader/frame.frag.glsl";
import type {ShaderCompiler, EntityPayload} from "@src/viewer/shared/controller";

export class FramePass {
	private program: WebGLProgram;
	private instanceBuffer: WebGLBuffer;
	private quadBuffer: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	private STRIDE = 6 * 4; // 24 байта (index, layer, edgeId, r, g, b)
	private activeInstancesCount = 0;

	private uEntityMatrixArrayLoc: WebGLUniformLocation | null;
	private uProjectionMatrixLoc: WebGLUniformLocation | null;
	private uViewMatrixLoc: WebGLUniformLocation | null;
	private uViewportSizeLoc: WebGLUniformLocation | null;

	constructor(
		private readonly gl: WebGL2RenderingContext,
		compiler: ShaderCompiler
	) {
		this.program = compiler.compile(frameVertexShader, frameFragmentShader);

		this.instanceBuffer = this.gl.createBuffer()!;
		this.quadBuffer = this.gl.createBuffer()!;

		// Шаблон ребра: X вдоль линии (0..1), Y поперек линии (-0.5..0.5)
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quadBuffer);
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array([
				0.0, -0.5,
				1.0, -0.5,
				0.0, 0.5,
				1.0, 0.5,
			]),
			this.gl.STATIC_DRAW
		);

		this.uEntityMatrixArrayLoc = this.gl.getUniformLocation(this.program, "u_entityMatrixArray");
		this.uProjectionMatrixLoc = this.gl.getUniformLocation(this.program, "u_projectionMatrix");
		this.uViewMatrixLoc = this.gl.getUniformLocation(this.program, "u_viewMatrix");
		this.uViewportSizeLoc = this.gl.getUniformLocation(this.program, "u_viewportSize");

		this.vao = this.gl.createVertexArray()!;
		this.setupVAO();
	}

	private setupVAO(): void {
		const gl = this.gl;
		const program = this.program;

		gl.bindVertexArray(this.vao);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
		const attributes = [
			{name: "a_entityMatrixIndex", size: 1, offset: 0},
			{name: "a_entityMatrixLayer", size: 1, offset: 1 * 4},
			{name: "a_edgeId", size: 1, offset: 2 * 4},
			{name: "a_color", size: 3, offset: 3 * 4},
		];

		for (const attribute of attributes) {
			const location = gl.getAttribLocation(program, attribute.name);
			if (location !== -1) {
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(location, attribute.size, gl.FLOAT, false, this.STRIDE, attribute.offset);
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
	}

	updateData(data: Float32Array, totalEdgesCount: number): void {
		const gl = this.gl;
		this.activeInstancesCount = totalEdgesCount;
		if (totalEdgesCount === 0) return;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STREAM_DRAW);
	}

	render(
		projMatrix: Float32Array,
		viewMatrix: Float32Array,
		viewportWidth: number,
		viewportHeight: number,
		entityBuffer: EntityPayload
	): void {
		if (this.activeInstancesCount === 0) return;

		const gl = this.gl;
		gl.useProgram(this.program);
		gl.bindVertexArray(this.vao);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, entityBuffer.getData());

		gl.uniform1i(this.uEntityMatrixArrayLoc, 0);
		gl.uniformMatrix3fv(this.uProjectionMatrixLoc, false, projMatrix);
		gl.uniformMatrix3fv(this.uViewMatrixLoc, false, viewMatrix);
		gl.uniform2f(this.uViewportSizeLoc, viewportWidth, viewportHeight);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.activeInstancesCount);

		gl.disable(gl.BLEND);
		gl.bindVertexArray(null);
	}
}
