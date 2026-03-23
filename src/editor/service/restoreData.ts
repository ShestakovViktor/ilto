import {Storage} from "@src/storage/controller";
import {WebBlobDriver, WebStashDriver} from "@src/utility/driver";
import {ArchiveDriver} from "@src/utility/interface";

export async function restoreData(
    storage: Storage,
    linker: WebBlobDriver,
    archiver: ArchiveDriver,
    stash: WebStashDriver
): Promise<void> {
    const archive = await stash.getLocalBlob("save.ilto");
    const files = await archiver.extract(archive);
    const data = await linker.loadBlobs(files);

    storage.setData(data);
}
