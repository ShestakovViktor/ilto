import {WebImageDriver} from "@src/shared/driver";
import {Database} from "@src/shared/controller";
import {AssetKind} from "@src/asset/enum";
import {EntityKind} from "@src/entity/enum";
import {Layer, Tile} from "@src/entity/type";
import {Asset} from "@src/asset/type";

export async function initProject(
    database: Database,
    params: {
        name: string;
        width: number;
        height: number;
        background: File;
    }
): Promise<void> {
    const imageDriver = new WebImageDriver();

    const mime = "image/jpeg";

    const imageTiles = await imageDriver
        .initImage(params.width, params.height, params.background, mime);

    database.reInitData({
        config: {
            1: {id: 1, name: "name", string: params.name},
            2: {id: 2, name: "width", number: params.width},
            3: {id: 3, name: "height", number: params.height},
        },
    });

    database.data.entity.insert({
        id: 2,
        kind: EntityKind.Layer,
        childIds: [],
    });

    database.data.entity.insert({
        id: 1,
        kind: EntityKind.Layer,
        childIds: [2],
    });

    const tileIds: number[] = [];

    imageTiles.forEach((imageTile, index) => {
        const image = database.data.asset.create<Asset>({
            kind: AssetKind.Image,
            name: `tile ${index + 1}`,
            mime: imageTile.media,
            path: imageTile.path,
            size: imageTile.size,
        });

        const tile = database.data.entity.create<Tile>({
            kind: EntityKind.Tile,
            x: imageTile.x,
            y: imageTile.y,
            width: imageTile.width,
            height: imageTile.height,
            imageId: image.id,
        });

        tileIds.push(tile.id);
    });

    database.data.entity.update<Layer>(2, {childIds: tileIds});

    database.reload();
}