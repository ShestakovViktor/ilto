import outlineVertexShader from "@src/viewer/outline/outline.vert.glsl";
import outlineFragmentShader from "@src/viewer/outline/outline.frag.glsl";
import {type Attribute, RenderPass, type ShaderCompiler} from "@src/viewer/shared/controller";
import type {OutlinePayload} from "@src/viewer/outline";
import {BindingPoint} from "@src/viewer/shared/enum";

export class OutlinePass extends RenderPass {
	private program: WebGLProgram;
	private instanceBuffer: WebGLBuffer;
	private quadBuffer: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	// Новая структура инстанса (6 * 4 байта = 24 байта):
	// vec2 a_position   (0..7)   - 8 байт (FLOAT)
	// vec2 a_size       (8..15)  - 8 байт (FLOAT)
	// float a_thickness (16..19) - 4 байта (FLOAT)
	// uint a_color      (20..23) - 4 байта (UNSIGNED_BYTE, normalized)
	private stride = 6 * 4;
	private divisor = 4;

	protected get attributes(): Attribute[] {
		const gl = this.gl;
		return [
			{
				name: "a_position",
				location: 1,
				size: 2,
				type: gl.FLOAT,
				normalized: false,
				offset: 0 * 4,
			},
			{
				name: "a_size",
				location: 2,
				size: 2,
				type: gl.FLOAT,
				normalized: false,
				offset: 2 * 4,
			},
			{
				name: "a_thickness",
				location: 3,
				size: 1,
				type: gl.FLOAT,
				normalized: false,
				offset: 4 * 4,
			},
			{
				name: "a_color",
				location: 4,
				size: 4,
				type: gl.UNSIGNED_BYTE,
				normalized: true,
				offset: 5 * 4,
			},
		];
	}
	constructor(
		protected readonly gl: WebGL2RenderingContext,
		compiler: ShaderCompiler
	) {
		super(gl);

		this.program = compiler.compile(
			outlineVertexShader,
			outlineFragmentShader
		);

		this.bindUniformBlocks();
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

	render(outlinePayload: OutlinePayload): void {
		if (outlinePayload.getCount() === 0) return;

		const gl = this.gl;

		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			outlinePayload.getData(),
			gl.STREAM_DRAW
		);

		gl.bindVertexArray(this.vao);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// Умножение на 4 здесь критически важно: на каждую запись элемента в Payload
		// мы обязаны запустить 4 инстанса WebGL, чтобы отрисовать все 4 стороны рамки.
		gl.drawArraysInstanced(
			gl.TRIANGLE_STRIP,
			0,
			4,
			outlinePayload.getCount() * 4
		);

		gl.disable(gl.BLEND);
		gl.bindVertexArray(null);
	}
}
