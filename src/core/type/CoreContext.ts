import type {ArchiverDriver, GraphicsDriver} from "@src/core/interface";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/core/driver";
import type {Storage} from "@src/core/controller";

export type CoreContext = {
	archiver: ArchiverDriver;
	fetcher: WebFetcherDriver;
	linker: WebLinkerDriver;
	graphics: GraphicsDriver;

	storage: Storage;
};