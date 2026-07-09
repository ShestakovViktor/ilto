import type {
	Canvas,
	Loop,
	Input,
	Scene,
	View,
	Frame,
	Overlay,
} from "@src/viewer/controller";
import type {ViewerState} from "@src/viewer/type";
import type {Ref} from "vue";

export type ViewerContext = {
	viewer: Ref<ViewerState>;

	view: View;
	frame: Frame;

	loop: Loop;
	input: Input;

	scene: Scene;
	canvas: Canvas;
	overlay: Overlay;
};