import type {ArchiverDriver, GraphicsDriver} from "@src/shared/interface";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/storage/controller/driver";
import type {EventBus, DataRepository} from "@src/storage/controller";

export type CoreContext = {
	archiver: ArchiverDriver;
	fetcher: WebFetcherDriver;
	linker: WebLinkerDriver;
	graphics: GraphicsDriver;

	storage: DataRepository;
	bus: EventBus;
};