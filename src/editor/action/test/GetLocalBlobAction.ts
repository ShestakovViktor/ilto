import {Action} from "@src/editor/controller";
import type {FetcherDriver} from "@src/core/interface";

export class GetLocalBlobAction extends Action<Blob> {
	name = "GetLocalBlob";

	constructor(
		private fetcher: FetcherDriver,
		public payload: {name: string}
	) {
		super();
	}

	async exec(): Promise<Blob> {
		return await this.fetcher.getLocalBlob(this.payload.name);
	}

	undo(): void {}
}