import {Canvas, Scene, Input, Loop, Viewport} from "@src/viewer/controller";
import type {Storage} from "@src/core/controller";

export function initViewerModule(deps: {
	storage: Storage;
}): {
	viewport: Viewport;
	loop: Loop;
	input: Input;
	scene: Scene;
	canvas: Canvas;
} {
	const viewport = new Viewport();
	const canvas = new Canvas(deps.storage, viewport);
	const loop = new Loop(viewport, canvas);
	const input = new Input(loop, viewport);
	const scene = new Scene();

	return {
		viewport,
		loop,
		input,
		scene,
		canvas,
	};
}