import {Action} from "@src/shared/controller";
import type {Storage} from "@src/storage/Storage";

export class ProjectRestoreAction extends Action {
	name = "ProjectRestoreAction";

	constructor(
		private storage: Storage,
		public payload: {name: string}
	) {
		super();
	}

	async exec(): Promise<void> {
		const archive = await this.storage
			.fetcher.getLocalBlob(this.payload.name);
		const files = await this.storage
			.archiver.extract(archive);
		const data = await this.storage
			.linker.loadBlobs(files);
		this.storage.repo.setData(data);
	}

	undo(): void {}
}