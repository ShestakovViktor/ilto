import type {ShaderCompiler} from "@src/viewer/shared/controller";
import {
	AdornerPayload,
	AdornerBuffer,
	AdornerPass,
	type Adorner,
} from "@src/viewer/adorner";

export class AdornerManager {
	private buffer!: AdornerBuffer;
	private payload!: AdornerPayload;
	private pass!: AdornerPass;

	init(
		gl: WebGL2RenderingContext,
		compiler: ShaderCompiler
	): void {
		this.buffer = new AdornerBuffer(gl);
		this.payload = new AdornerPayload();
		this.pass = new AdornerPass(gl, compiler);
	}

	update(adorners: Adorner[]): void {
		this.payload.clear();

		adorners.forEach((adorner) => {
			this.payload.add(adorner);
		});
	}

	render(): void {
		this.pass.render(this.payload);
	}
}
