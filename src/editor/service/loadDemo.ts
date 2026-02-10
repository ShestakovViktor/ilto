import {Database} from "@src/shared/controller";
import {WebBlobDriver, WebStashDriver} from "@src/shared/driver";
import {ArchiveDriver} from "@src/shared/interface";

export async function loadDemo(
    database: Database,
    blober: WebBlobDriver,
    archiver: ArchiveDriver,
    browser: WebStashDriver
): Promise<void> {
    const archive = await browser.getRemoteBlob("demo.ilto");
    const files = await archiver.extract(archive);
    const data = await blober.loadBlobs(files);

    database.setData(data);
}