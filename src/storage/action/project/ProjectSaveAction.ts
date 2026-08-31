import {Action} from "@src/shared/controller";
import type {Storage} from "@src/storage/Storage";

export class ProjectSaveAction extends Action {
	name = "ProjectSaveAction";

	constructor(
		private storage: Storage,
		public payload: {name: string}
	) {
		super();
	}

	async exec(): Promise<void> {
		const data = this.storage.repo.getData();
		const dataClone = JSON.parse(JSON.stringify(data));
		const blobs = await this.storage.linker.unloadBlobs(dataClone);
		const archive = await this.storage.archiver.archive(blobs);
		await this.storage.fetcher.putLocalBlob(this.payload.name, archive);
	}

	undo(): void {}
}