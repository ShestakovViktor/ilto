import adornerVertexShader from "@src/viewer/adorner/adorner.vert.glsl";
import adornerFragmentShader from "@src/viewer/adorner/adorner.frag.glsl";
import {type Attribute, RenderPass, type ShaderCompiler} from "@src/viewer/shared/controller";
import type {AdornerPayload} from "@src/viewer/adorner";
import {BindingPoint, UniformBlock} from "@src/viewer/shared/enum";

export class AdornerPass extends RenderPass {
	private program: WebGLProgram;
	private instanceBuffer: WebGLBuffer;
	private quadBuffer: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	private stride = 4 * 4;
	private divisor = 1;

	protected get attributes(): Attribute[] {
		const gl = this.gl;
		return [
			{
				name: "a_position",
				location: 1,
				size: 2,
				type: this.gl.FLOAT,
				normalized: false,
				offset: 0 * 4,
			},
			{
				name: "a_type",
				location: 2,
				size: 1,
				type: gl.INT,
				offset: 2 * 4,
				normalized: false,
			},
			{
				name: "a_color",
				location: 3,
				size: 4,
				type: gl.UNSIGNED_BYTE,
				normalized: true,
				offset: 3 * 4,
			},
		];
	}

	constructor(
		protected readonly gl: WebGL2RenderingContext,
		compiler: ShaderCompiler
	) {
		super(gl);

		this.program = compiler.compile(
			adornerVertexShader,
			adornerFragmentShader
		);

		this.bindUniformBlocks();
		this.instanceBuffer = this.initInstanceBuffer();
		this.quadBuffer = this.initQuadBuffer();
		this.vao = this.initVAO();

	}

	private bindUniformBlocks(): void {
		this.bindUniformBlock(
			this.program,
			UniformBlock.Shared,
			BindingPoint.Shared
		);

		this.bindUniformBlock(
			this.program,
			UniformBlock.Adorner,
			BindingPoint.Adorner
		);
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

	render(adornerPayload: AdornerPayload): void {
		if (adornerPayload.getCount() === 0) return;

		const gl = this.gl;

		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			adornerPayload.getData(),
			gl.STREAM_DRAW
		);

		gl.bindVertexArray(this.vao);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.drawArraysInstanced(
			gl.TRIANGLE_STRIP,
			0,
			4,
			adornerPayload.getCount()
		);

		gl.disable(gl.BLEND);
		gl.bindVertexArray(null);
	}
}
