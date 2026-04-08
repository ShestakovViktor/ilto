import {Storage} from "@src/storage/controller";
import {EntityKind} from "@src/core/enum";
import {Layer} from "@src/core/type";

export async function initProject(
    storage: Storage,
    params: {
        name: string;
        width: number;
        height: number;
    }
): Promise<void> {
    storage.reInitData({
        config: {
            1: {id: 1, name: "name", string: params.name},
            2: {id: 2, name: "width", number: params.width},
            3: {id: 3, name: "height", number: params.height},
        },
    });

    storage.data.entity.insert<Layer>({
        id: 1,
        kind: EntityKind.Layer,
        prop: [],
        childIds: [],
        x: 0,
        y: 0,
        name: "",
    });

    storage.reload();
}