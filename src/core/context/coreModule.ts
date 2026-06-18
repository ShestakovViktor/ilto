import type {CoreContext, Schema} from "@src/core/type";
import {
	WebLinkerDriver,
	WebFetcherDriver,
	WebArchiverDriver,
	WebGraphicsDriver,
} from "@src/core/driver";
import {Storage} from "@src/core/controller";

export function initCoreModule(data?: Schema): CoreContext {
	const storage = new Storage(data);

	const fetcher = new WebFetcherDriver();
	const linker = new WebLinkerDriver();
	const archiver = new WebArchiverDriver();
	const graphics = new WebGraphicsDriver();

	return {
		storage,

		archiver,
		fetcher,
		linker,
		graphics,
	};
}
