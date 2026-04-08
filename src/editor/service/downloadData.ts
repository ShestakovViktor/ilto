import {Storage} from "@src/storage/controller";
import {WebBlobDriver, WebStashDriver} from "@src/core/driver";
import {ArchiveDriver} from "@src/core/interface";

export async function downloadData(
    storage: Storage,
    linker: WebBlobDriver,
    archiver: ArchiveDriver,
    browser: WebStashDriver
): Promise<void> {
    const data = storage.extract();
    const dataClone = JSON.parse(JSON.stringify(data));
    const blobs = await linker.unloadBlobs(dataClone);
    const archive = await archiver.archive(blobs);
    browser.downloadFile(archive, "project.ilto");
}