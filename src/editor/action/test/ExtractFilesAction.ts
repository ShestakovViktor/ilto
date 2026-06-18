import {Action} from "@src/editor/controller";
import type {ArchiverDriver} from "@src/core/interface";

export class ExtractFilesAction extends Action<Record<string, Blob>> {
	name = "ExtractFilesAction";

	constructor(
		private archiver: ArchiverDriver,
		public payload: {archive: Blob}
	) {
		super();
	}

	async exec(): Promise<Record<string, Blob>> {
		return await this.archiver.extract(this.payload.archive);
	}

	undo(): void {}
}