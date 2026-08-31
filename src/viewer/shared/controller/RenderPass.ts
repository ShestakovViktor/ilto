import type {BindingPoint, UniformBlock} from "../enum";

export interface Attribute {
	name: string;
	location: number;
	size: number;
	type: number;
	normalized: boolean;
	offset: number;
}

export abstract class RenderPass {
	protected abstract program: WebGLProgram;

	protected abstract get attributes(): Attribute[];

	constructor(protected readonly gl: WebGL2RenderingContext) {}

	protected getUniformLocation(name: string): WebGLUniformLocation | null {
		return this.gl.getUniformLocation(this.program, name);
	}

	protected initInstanceBuffer(): WebGLBuffer {
		return this.gl.createBuffer();
	}

	protected bindInstanceBuffer(
		instanceBuffer: WebGLBuffer,
		attributes: Attribute[],
		stride: number,
		divisor: number
	): void {
		const gl = this.gl;

		gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);

		for (const attribute of attributes) {
			gl.enableVertexAttribArray(attribute.location);

			if (attribute.type === gl.INT) {
				gl.vertexAttribIPointer(
					attribute.location,
					attribute.size,
					attribute.type,
					stride,
					attribute.offset
				);
			}
			else {
				gl.vertexAttribPointer(
					attribute.location,
					attribute.size,
					attribute.type,
					attribute.normalized,
					stride,
					attribute.offset
				);
			}

			gl.vertexAttribDivisor(attribute.location, divisor);
		}
	}

	protected initQuadBuffer(): WebGLBuffer {
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

	protected bindQuadBuffer(quadBuffer: WebGLBuffer): void {
		const gl = this.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);

		const location = 0;
		gl.enableVertexAttribArray(location);
		gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
		gl.vertexAttribDivisor(location, 0);
	}

	protected bindUniformBlock(
		program: WebGLProgram,
		blockName: UniformBlock,
		bindingPoint: BindingPoint
	): void {
		const gl = this.gl;
		const blockIndex = gl.getUniformBlockIndex(program, blockName);

		if (blockIndex !== gl.INVALID_INDEX) {
			gl.uniformBlockBinding(program, blockIndex, bindingPoint);
		}
	}
}