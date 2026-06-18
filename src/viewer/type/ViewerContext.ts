import type {Canvas, Loop, Input, Scene, Viewport} from "@src/viewer/controller";
import type {ViewerState} from "@src/viewer/type";
import type {Ref} from "vue";

export type ViewerContext = {
	viewer: Ref<ViewerState>;

	viewport: Viewport;
	loop: Loop;
	input: Input;

	canvas: Canvas;
	scene: Scene;
};