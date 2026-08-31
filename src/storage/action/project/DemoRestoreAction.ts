import {Action} from "@src/shared/controller";
import type {
	ArchiverDriver,
	FetcherDriver,
	LinkerDriver,
} from "@src/shared/interface";
import type {DataRepository} from "@src/storage/controller";

export class DemoRestoreAction extends Action {
	name = "DemoRestoreAction";

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
		const archive = await this.fetcher.getRemoteBlob(this.payload.name);
		const files = await this.archiver.extract(archive);
		const data = await this.linker.loadBlobs(files);

		this.storage.setData(data);
	}

	revert(): void {}
}