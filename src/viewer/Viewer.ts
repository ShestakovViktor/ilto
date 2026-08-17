import type {Core} from "@src/core/Core";
import {
	Canvas,
	Scene,
	Input,
	Loop,
	View,
	Frame,
	Overlay,
} from "@src/viewer/controller";
import type {Telemetry} from "./type";

export class Viewer {
	readonly scene: Scene;
	readonly view: View;
	readonly frame: Frame;
	readonly canvas: Canvas;
	readonly overlay: Overlay;
	readonly loop: Loop;
	readonly input: Input;

	constructor(core: Core, telemetry: Telemetry){
		this.scene = new Scene(core.storage);
		this.view = new View();
		this.frame = new Frame();
		this.canvas = new Canvas(
			this.view,
			this.frame,
			this.scene,
			core.storage
		);
		this.overlay = new Overlay(this.view);
		this.loop = new Loop(this.view, this.canvas, this.overlay);
		this.input = new Input(this.view, this.frame, this.loop, this.scene);
	}
}