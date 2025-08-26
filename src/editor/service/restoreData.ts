import {Database} from "@src/shared/controller";
import {WebBlobDriver, WebStashDriver} from "@src/shared/driver";
import {ArchiveDriver} from "@src/shared/interface";

export async function restoreData(
    database: Database,
    linker: WebBlobDriver,
    archiver: ArchiveDriver,
    file: WebStashDriver
): Promise<void> {
    const archive = await file.getBlob("save.ilto");
    const files = await archiver.extract(archive);
    const data = await linker.loadBlobs(files);

    database.setData(data);
}
