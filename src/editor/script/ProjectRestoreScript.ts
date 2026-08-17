import {ProjectRestoreAction} from "@src/core/action/project";
import type {DataStorage} from "@src/core/controller";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/core/driver";
import type {ArchiverDriver, FetcherDriver, LinkerDriver} from "@src/core/interface";
import {type Action, Script} from "@src/core/library";
import {SceneUpdateAction} from "@src/viewer/action";
import type {Canvas, Loop, Scene} from "@src/viewer/controller";

export class ProjectRestoreScript extends Script<void> {
	name = "ProjectRestoreScript";

	constructor (
		private storage: DataStorage,
		private fetcher: FetcherDriver,
		private archiver: ArchiverDriver,
		private linker: LinkerDriver,
		private scene: Scene,
		private loop: Loop,
		private canvas: Canvas,

		public payload: {
			name: string;
		}
	){
		super();
	}

	protected async run(
		exec: <R>(item: Action<R>) => Promise<R>
	): Promise<void> {
		await exec(
			new ProjectRestoreAction(
				this.storage,
				this.fetcher,
				this.archiver,
				this.linker,
				{name: "save.ilto"}
			)
		);
		await exec(
			new SceneUpdateAction(
				this.scene,
				this.loop,
				this.canvas
			)
		);
	}

	override async undo(): Promise<void> {
	}
}
