import type {Schema, Stats} from "@src/storage/type";
import type {
	ArchiverDriver,
	FetcherDriver,
	GraphicsDriver,
	LinkerDriver,
} from "@src/shared/interface";
import {
	WebLinkerDriver,
	WebFetcherDriver,
	WebArchiverDriver,
	WebGraphicsDriver,
} from "@src/storage/controller/driver";
import {DataRepository} from "@src/storage/controller";

export class Storage {
	readonly repo: DataRepository;

	readonly fetcher: FetcherDriver;

	readonly linker: LinkerDriver;

	readonly archiver: ArchiverDriver;

	readonly graphics: GraphicsDriver;

	constructor(public stats: Stats, data?: Schema) {
		this.repo = new DataRepository(data);
		this.fetcher = new WebFetcherDriver();
		this.linker = new WebLinkerDriver();
		this.archiver = new WebArchiverDriver();
		this.graphics = new WebGraphicsDriver();
	}
}