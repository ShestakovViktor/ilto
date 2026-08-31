import {BindingPoint} from "../enum";

export class SharedBuffer {
	private buffer: WebGLBuffer;
	private data = new Float32Array(28);

	constructor(private readonly gl: WebGL2RenderingContext) {
		this.buffer = this.gl.createBuffer()!;

		this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
		this.gl.bufferData(
			this.gl.UNIFORM_BUFFER,
			this.data.length * 4,
			this.gl.DYNAMIC_DRAW
		);

		this.gl.bindBufferBase(
			this.gl.UNIFORM_BUFFER,
			BindingPoint.Shared,
			this.buffer
		);

		this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
	}

	update(
		projMatrix: Float32Array,
		viewMatrix: Float32Array,
		width: number,
		height: number
	): void {
		this.packMat3(0, projMatrix);
		this.packMat3(12, viewMatrix);

		this.packVec2(24, width, height);

		const gl = this.gl;
		gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer);
		gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.data);
		gl.bindBuffer(gl.UNIFORM_BUFFER, null);
	}

	private packVec2(offset: number, x: number, y: number): void {
		this.data[offset + 0] = x;
		this.data[offset + 1] = y;
	}

	private packMat3(offset: number, mat3: Float32Array): void {
		this.data[offset + 0] = mat3[0];
		this.data[offset + 1] = mat3[1];
		this.data[offset + 2] = mat3[2];

		this.data[offset + 4] = mat3[3];
		this.data[offset + 5] = mat3[4];
		this.data[offset + 6] = mat3[5];

		this.data[offset + 8] = mat3[6];
		this.data[offset + 9] = mat3[7];
		this.data[offset + 10] = mat3[8];
	}
}
