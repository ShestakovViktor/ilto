import {Action} from "@src/core/library";
import type {
	ArchiverDriver,
	FetcherDriver,
	LinkerDriver,
} from "@src/core/interface";
import type {DataStorage} from "@src/core/controller";

export class DemoRestoreAction extends Action {
	name = "DemoRestoreAction";

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
		const archive = await this.fetcher.getRemoteBlob(this.payload.name);
		const files = await this.archiver.extract(archive);
		const data = await this.linker.loadBlobs(files);

		this.storage.setData(data);
	}

	undo(): void {}
}