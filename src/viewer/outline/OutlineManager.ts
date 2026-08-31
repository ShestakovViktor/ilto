import type {ShaderCompiler} from "@src/viewer/shared/controller";
import {
	OutlinePayload,
	OutlinePass,
	type OutlineElement,
} from "@src/viewer/outline";

export class OutlineManager {
	private payload!: OutlinePayload;
	private pass!: OutlinePass;

	init(
		gl: WebGL2RenderingContext,
		compiler: ShaderCompiler
	): void {
		this.payload = new OutlinePayload();
		this.pass = new OutlinePass(gl, compiler);
	}

	update(elements: OutlineElement[]): void {
		this.payload.clear();

		elements.forEach((element) => {
			this.payload.add(element);
		});
	}

	render(): void {
		this.pass.render(this.payload);
	}
}
