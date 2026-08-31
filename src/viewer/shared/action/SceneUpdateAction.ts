import {Action} from "@src/shared/controller";
import type {Viewer} from "@src/viewer/Viewer";

export class SceneUpdateAction extends Action {
	name = "SceneUpdateAction";

	constructor(private viewer: Viewer) {
		super();
	}

	async exec(): Promise<void> {
		this.viewer.scene.update();
		await this.viewer.canvas.initScene();
		this.viewer.loop.requestUpdate();

		this.viewer.scene.createQuadTree();
	}

	undo(): void {}
}