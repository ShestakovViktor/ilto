import {BindingPoint} from "@src/viewer/shared/enum";
import {AdornerCatalog} from "@src/viewer/adorner";

export class AdornerBuffer {
	private buffer: WebGLBuffer;
	private data: Float32Array;

	constructor(private readonly gl: WebGL2RenderingContext) {
		this.data = new Float32Array(256);
		this.buffer = this.gl.createBuffer()!;
		this.setupDefaultPresets();

		this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, this.buffer);
		this.gl.bufferData(
			this.gl.UNIFORM_BUFFER,
			this.data,
			this.gl.STATIC_DRAW
		);

		this.gl.bindBufferBase(
			this.gl.UNIFORM_BUFFER,
			BindingPoint.Adorner,
			this.buffer
		);

		this.gl.bindBuffer(this.gl.UNIFORM_BUFFER, null);
	}

	private setupDefaultPresets(): void {
		for (const name in AdornerCatalog) {
			this.packPreset(AdornerCatalog[name]);
		}
	}

	private packPreset(data: {
		id: number;
		size: number;
		width: number;
	}): void {
		const offset = data.id * 4;

		this.data[offset + 0] = data.id;
		this.data[offset + 1] = data.size;
		this.data[offset + 2] = data.width;
		this.data[offset + 3] = 0;
	}
}