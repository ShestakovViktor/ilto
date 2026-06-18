import type {Storage} from "@src/storage/controller";
import type {WebLinkerDriver, WebFetcherDriver} from "@src/core/driver";
import type {ArchiverDriver} from "@src/core/interface";

export async function loadDemo(
	storage: Storage,
	blober: WebLinkerDriver,
	archiver: ArchiverDriver,
	browser: WebFetcherDriver
): Promise<void> {
	const archive = await browser.getRemoteBlob("demo.ilto");
	const files = await archiver.extract(archive);
	const data = await blober.loadBlobs(files);

	storage.setData(data);
}
