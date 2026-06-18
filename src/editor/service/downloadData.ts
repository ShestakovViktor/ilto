import type {Storage} from "@src/storage/controller";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/core/driver";
import type {ArchiverDriver} from "@src/core/interface";

export async function downloadData(
	storage: Storage,
	linker: WebLinkerDriver,
	archiver: ArchiverDriver,
	browser: WebFetcherDriver
): Promise<void> {
	const data = storage.getData();
	const dataClone = JSON.parse(JSON.stringify(data));
	const blobs = await linker.unloadBlobs(dataClone);
	const archive = await archiver.archive(blobs);
	browser.downloadFile(archive, "project.ilto");
}
