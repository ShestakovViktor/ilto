import {Action} from "@src/core/library";
import type {Canvas, Loop, Scene} from "@src/viewer/controller";

export class SceneUpdateAction extends Action {
	name = "SceneUpdateAction";

	constructor(
		private scene: Scene,
		private loop: Loop,
		private canvas: Canvas
	) {
		super();
	}

	async exec(): Promise<void> {
		this.scene.update();
		await this.canvas.initScene();
		this.loop.requestUpdate();
	}

	undo(): void {}
}