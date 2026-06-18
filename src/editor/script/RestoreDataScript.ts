import type {Storage} from "@src/core/controller";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/core/driver";
import type {ArchiverDriver} from "@src/core/interface";
import {type Action, Script} from "@src/editor/controller";
import {ExtractFilesAction, GetLocalBlobAction} from "../action/test";
import {LoadBlobsAction} from "../action/test/LoadBlobsAction";

export class RestoreDataScript extends Script<void> {
	name = "RestoreDataScript";

	constructor (
		private storage: Storage,
		private linker: WebLinkerDriver,
		private archiver: ArchiverDriver,
		private fetcher: WebFetcherDriver,
		public payload: {
			name: string;
		}
	){
		super();
	}

	protected async run(
		exec: <R>(item: Action<R>) => Promise<R>
	): Promise<void> {
		const archive = await exec(
			new GetLocalBlobAction(this.fetcher, {name: this.payload.name})
		);

		const files = await exec(
			new ExtractFilesAction(this.archiver, {archive})
		);

		const data = await exec(
			new LoadBlobsAction(this.linker, {files})
		);

		this.storage.setData(data);
	}
}

