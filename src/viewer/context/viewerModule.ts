import type {Storage} from "@src/core/controller";
import {
	Canvas,
	Scene,
	Input,
	Loop,
	View,
	Frame,
	Overlay,
} from "@src/viewer/controller";

export function initViewerModule(deps: {
	storage: Storage;
}): {
	view: View;
	frame: Frame;
	loop: Loop;
	input: Input;
	scene: Scene;
	canvas: Canvas;
	overlay: Overlay;
} {
	const scene = new Scene(deps.storage);
	const view = new View();
	const frame = new Frame();
	const canvas = new Canvas(view, frame, scene, deps.storage);
	const overlay = new Overlay(view);
	const loop = new Loop(view, canvas, overlay);
	const input = new Input(view, frame, loop, scene);

	return {
		view,
		frame,
		loop,
		input,
		scene,
		canvas,
		overlay,
	};
}