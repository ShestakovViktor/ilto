import {Action} from "@src/shared/controller";
import type {Canvas, Loop, Scene} from "@src/viewer/shared/controller";

export class SceneUpdateAction extends Action {
	name = "SceneUpdateAction";

	constructor(
		private scene: Scene,
		private loop: Loop,
		private canvas: Canvas
	) {
		super();
	}

	async apply(): Promise<void> {
		this.scene.update();
		await this.canvas.initScene();
		this.loop.requestUpdate();

		this.scene.createQuadTree();
	}

	revert(): void {}
}