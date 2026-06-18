import {Action} from "@src/editor/controller";
import type {LinkerDriver} from "@src/core/interface";
import type {Schema} from "@src/core/type";

export class LoadBlobsAction extends Action<Schema> {
	name = "LoadBlobsAction";

	constructor(
		private linker: LinkerDriver,
		public payload: {files: Record<string, Blob>}
	) {
		super();
	}

	async exec(): Promise<Schema> {
		return await this.linker.loadBlobs(this.payload.files);
	}

	undo(): void {}
}