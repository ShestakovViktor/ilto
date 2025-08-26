import {Database} from "@src/shared/controller";
import {WebBlobDriver, WebStashDriver} from "@src/shared/driver";
import {ArchiveDriver} from "@src/shared/interface";

export async function downloadData(
    database: Database,
    linker: WebBlobDriver,
    archiver: ArchiveDriver,
    browser: WebStashDriver
): Promise<void> {
    const data = database.extract();
    const dataClone = JSON.parse(JSON.stringify(data));
    const blobs = await linker.unloadBlobs(dataClone);
    const archive = await archiver.archive(blobs);
    browser.downloadFile(archive, "project.ilto");
}