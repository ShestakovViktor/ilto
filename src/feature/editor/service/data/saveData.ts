import {Store} from "@feature/store";
import {ArchiveDriver} from "@interface";
import {archiveData} from "@feature/editor/service/data";
import {putBlobToBrowser} from "@feature/editor/service/browser";

export async function saveData(
    store: Store,
    archiveDriver: ArchiveDriver
): Promise<void> {
    const data = store.extract();
    const archive = await archiveData(archiveDriver, data);
    await putBlobToBrowser("save.ilto", archive);
}