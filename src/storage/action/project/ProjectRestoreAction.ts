import {Action} from "@src/shared/controller";
import type {
	ArchiverDriver,
	FetcherDriver,
	LinkerDriver,
} from "@src/shared/interface";
import type {DataRepository} from "@src/storage/controller";

export class ProjectRestoreAction extends Action {
	name = "ProjectRestoreAction";

	constructor(
		private storage: DataRepository,
		private fetcher: FetcherDriver,
		private archiver: ArchiverDriver,
		private linker: LinkerDriver,
		public payload: {name: string}
	) {
		super();
	}

	async apply(): Promise<void> {
		const archive = await this.fetcher.getLocalBlob(this.payload.name);
		const files = await this.archiver.extract(archive);
		const data = await this.linker.loadBlobs(files);
		this.storage.setData(data);
	}

	revert(): void {}
}