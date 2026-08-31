import {Action} from "@src/shared/controller";
import type {
	ArchiverDriver,
	FetcherDriver,
	LinkerDriver,
} from "@src/shared/interface";
import type {DataRepository} from "@src/storage/controller";

export class ProjectDownloadAction extends Action {
	name = "ProjectDownloadAction";

	constructor(
		private storage: DataRepository,
		private linker: LinkerDriver,
		private archiver: ArchiverDriver,
		private fetcher: FetcherDriver,
		public payload: {name: string}
	) {
		super();
	}

	async apply(): Promise<void> {
		const data = this.storage.getData();
		const dataClone = JSON.parse(JSON.stringify(data));
		const blobs = await this.linker.unloadBlobs(dataClone);
		const archive = await this.archiver.archive(blobs);
		this.fetcher.downloadFile(archive, this.payload.name);
	}

	revert(): void {}
}