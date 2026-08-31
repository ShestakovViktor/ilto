import adornerVertexShader from "@src/viewer/adorner/adorner.vert.glsl";
import adornerFragmentShader from "@src/viewer/adorner/adorner.frag.glsl";
import type {ShaderCompiler} from "@src/viewer/shared/controller";
import type {AdornerPayload} from "@src/viewer/adorner";
import {BindingPoint} from "@src/viewer/shared/enum";

export class AdornerPass {
	private program: WebGLProgram;
	private instanceBuffer: WebGLBuffer;
	private quadBuffer: WebGLBuffer;
	private vao: WebGLVertexArrayObject;

	private stride = 4 * 4;

	constructor(
		private readonly gl: WebGL2RenderingContext,
		compiler: ShaderCompiler
	) {
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
		const sharedBlockIndex = this.gl
			.getUniformBlockIndex(this.program, "SharedBuffer");

		if (sharedBlockIndex !== this.gl.INVALID_INDEX) {
			this.gl.uniformBlockBinding(
				this.program,
				sharedBlockIndex,
				BindingPoint.Shared
			);
		}

		const settingsBlockIndex = this.gl
			.getUniformBlockIndex(this.program, "AdornerBuffer");
		if (settingsBlockIndex !== this.gl.INVALID_INDEX) {
			this.gl.uniformBlockBinding(
				this.program,
				settingsBlockIndex,
				BindingPoint.Adorner
			);
		}
	}

	private initInstanceBuffer(): WebGLBuffer {
		return this.gl.createBuffer();
	}

	private initQuadBuffer(): WebGLBuffer {
		const gl = this.gl;

		const quadBuffer = gl.createBuffer();

		this.gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
		this.gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
			gl.STATIC_DRAW
		);

		return quadBuffer;
	}

	private initVAO(): WebGLVertexArrayObject {
		const gl = this.gl;

		const vao = gl.createVertexArray();

		gl.bindVertexArray(vao);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);

		const attributes = [
			{
				name: "a_position",
				location: 0,
				size: 2,
				type: gl.FLOAT,
				normalized: false,
				offset: 0 * 4,
			},
			{
				name: "a_type",
				location: 1,
				size: 1,
				type: gl.INT,
				offset: 2 * 4,
			},
			{
				name: "a_color",
				location: 2,
				size: 4,
				type: gl.UNSIGNED_BYTE,
				normalized: true,
				offset: 3 * 4,
			},
		];

		for (const attribute of attributes) {
			gl.enableVertexAttribArray(attribute.location);

			if (attribute.type === gl.INT) {
				gl.vertexAttribIPointer(
					attribute.location,
					attribute.size,
					attribute.type,
					this.stride,
					attribute.offset
				);
			}
			else {
				gl.vertexAttribPointer(
					attribute.location,
					attribute.size,
					attribute.type,
					attribute.normalized,
					this.stride,
					attribute.offset
				);
			}

			gl.vertexAttribDivisor(attribute.location, 1);
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);

		const aQuadVertexLocation = 3;
		gl.enableVertexAttribArray(aQuadVertexLocation);
		gl.vertexAttribPointer(aQuadVertexLocation, 2, gl.FLOAT, false, 0, 0);
		gl.vertexAttribDivisor(aQuadVertexLocation, 0);

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
