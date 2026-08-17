import {Action} from "@src/core/library";
import type {
	ArchiverDriver,
	FetcherDriver,
	LinkerDriver,
} from "@src/core/interface";
import type {DataStorage} from "@src/core/controller";

export class ProjectDownloadAction extends Action {
	name = "ProjectDownloadAction";

	constructor(
		private storage: DataStorage,
		private linker: LinkerDriver,
		private archiver: ArchiverDriver,
		private fetcher: FetcherDriver,
		public payload: {name: string}
	) {
		super();
	}

	async exec(): Promise<void> {
		const data = this.storage.getData();
		const dataClone = JSON.parse(JSON.stringify(data));
		const blobs = await this.linker.unloadBlobs(dataClone);
		const archive = await this.archiver.archive(blobs);
		this.fetcher.downloadFile(archive, this.payload.name);
	}

	undo(): void {}
}