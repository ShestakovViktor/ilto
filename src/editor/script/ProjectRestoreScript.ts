import {ProjectRestoreAction} from "@src/storage/action/project";
import {Script} from "@src/shared/controller";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import type {Viewer} from "@src/viewer/Viewer";
import type {Storage} from "@src/storage/Storage";

export class ProjectRestoreScript extends Script<void> {
	name = "ProjectRestoreScript";

	constructor (
		private storage: Storage,
		private viewer: Viewer,
		public payload: {name: string}
	){
		super();
	}

	protected async invoke(): Promise<void> {
		await this.engine.exec(
			new ProjectRestoreAction(
				this.storage,
				{name: "save.ilto"}
			)
		);
		await this.engine.exec(
			new SceneUpdateAction(this.viewer)
		);
	}

	override async revert(): Promise<void> {
	}
}
