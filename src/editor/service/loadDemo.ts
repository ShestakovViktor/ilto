import {Storage} from "@src/storage/controller";
import {WebBlobDriver, WebStashDriver} from "@src/core/driver";
import {ArchiveDriver} from "@src/core/interface";

export async function loadDemo(
    storage: Storage,
    blober: WebBlobDriver,
    archiver: ArchiveDriver,
    browser: WebStashDriver
): Promise<void> {
    const archive = await browser.getRemoteBlob("demo.ilto");
    const files = await archiver.extract(archive);
    const data = await blober.loadBlobs(files);

    storage.setData(data);
}