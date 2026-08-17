import type {Schema, Stats} from "@src/core/type";
import type {
	ArchiverDriver,
	FetcherDriver,
	GraphicsDriver,
	LinkerDriver,
} from "@src/core/interface";
import {
	WebLinkerDriver,
	WebFetcherDriver,
	WebArchiverDriver,
	WebGraphicsDriver,
} from "@src/core/driver";
import {DataStorage} from "@src/core/controller";

export class Core {
	readonly storage: DataStorage;

	readonly fetcher: FetcherDriver;

	readonly linker: LinkerDriver;

	readonly archiver: ArchiverDriver;

	readonly graphics: GraphicsDriver;

	constructor(public stats: Stats, data?: Schema) {
		this.storage = new DataStorage(data);
		this.fetcher = new WebFetcherDriver();
		this.linker = new WebLinkerDriver();
		this.archiver = new WebArchiverDriver();
		this.graphics = new WebGraphicsDriver();
	}
}