import type {ArchiverDriver, GraphicsDriver} from "@src/core/interface";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/core/driver";
import type {EventBus, DataStorage} from "@src/core/controller";

export type CoreContext = {
	archiver: ArchiverDriver;
	fetcher: WebFetcherDriver;
	linker: WebLinkerDriver;
	graphics: GraphicsDriver;

	storage: DataStorage;
	bus: EventBus;
};