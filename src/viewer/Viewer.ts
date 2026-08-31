import type {Storage} from "@src/storage/Storage";
import {
	Canvas,
	Scene,
	Input,
	Loop,
	View,
	Frame,
} from "@src/viewer/shared/controller";
import type {Telemetry} from "@src/viewer/shared/type";
import {AdornerManager} from "./adorner";

export class Viewer {
	readonly scene: Scene;
	readonly view: View;
	readonly frame: Frame;
	readonly adorner: AdornerManager;
	readonly canvas: Canvas;
	readonly loop: Loop;
	readonly input: Input;

	constructor(storage: Storage, telemetry: Telemetry){
		this.scene = new Scene(storage.repo);
		this.view = new View();
		this.frame = new Frame();
		this.adorner = new AdornerManager();
		this.canvas = new Canvas(
			storage.repo,
			this.view,
			this.frame,
			this.scene,
			this.adorner
		);
		this.loop = new Loop(this.view, this.canvas, telemetry);
		this.input = new Input(
			this.view,
			this.frame,
			this.loop,
			this.scene
		);
	}
}