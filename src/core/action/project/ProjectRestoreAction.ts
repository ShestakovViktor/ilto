import {Action} from "@src/core/library";
import type {
	ArchiverDriver,
	FetcherDriver,
	LinkerDriver,
} from "@src/core/interface";
import type {DataStorage} from "@src/core/controller";

export class ProjectRestoreAction extends Action {
	name = "ProjectRestoreAction";

	constructor(
		private storage: DataStorage,
		private fetcher: FetcherDriver,
		private archiver: ArchiverDriver,
		private linker: LinkerDriver,
		public payload: {name: string}
	) {
		super();
	}

	async exec(): Promise<void> {
		const archive = await this.fetcher.getLocalBlob(this.payload.name);
		const files = await this.archiver.extract(archive);
		const data = await this.linker.loadBlobs(files);
		this.storage.setData(data);
	}

	undo(): void {}
}