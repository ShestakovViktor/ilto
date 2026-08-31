import {ProjectRestoreAction} from "@src/storage/action/project";
import type {DataRepository} from "@src/storage/controller";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/storage/controller/driver";
import type {ArchiverDriver, FetcherDriver, LinkerDriver} from "@src/shared/interface";
import {type Action, Script} from "@src/shared/controller";
import {SceneUpdateAction} from "@src/viewer/shared/action";
import type {Canvas, Loop, Scene} from "@src/viewer/shared/controller";

export class ProjectRestoreScript extends Script<void> {
	name = "ProjectRestoreScript";

	constructor (
		private storage: DataRepository,
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

	protected async applying(
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

	override async reverting(): Promise<void> {
	}
}
