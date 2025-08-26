import {WebImageDriver} from "@src/shared/driver";
import {Database} from "@src/shared/controller";
import {ASSET_TYPE} from "@src/asset/enum";
import {ENTITY_TYPE} from "@src/entity/enum";
import {Layer, Tile} from "@src/entity/type";
import {Image} from "@src/asset/type";

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

    const [layerType] = database.data.entityType
        .filter({name: ENTITY_TYPE.LAYER});

    if (!layerType) throw new Error();

    database.data.entity.insert({
        id: 2,
        entityTypeId: layerType.id,
        childIds: [],
    });

    database.data.entity.insert({
        id: 1,
        entityTypeId: layerType.id,
        childIds: [2],
    });

    const [imageType] = database.data.assetType
        .filter({name: ASSET_TYPE.IMAGE});
    const [tileType] = database.data.entityType
        .filter({name: ENTITY_TYPE.TILE});

    if (!imageType || !tileType) throw new Error();

    const tileIds: number[] = [];

    imageTiles.forEach((imageTile, index) => {
        const image = database.data.asset.create<Image>({
            assetTypeId: imageType.id,
            name: `tile ${index + 1}`,
            media: imageTile.media,
            path: imageTile.path,
            size: imageTile.size,
        });

        const tile = database.data.entity.create<Tile>({
            entityTypeId: tileType.id,
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