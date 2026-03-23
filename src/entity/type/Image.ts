import {Entity, Size, Spatial} from "@src/entity/type";
import {EntityKind} from "@src/entity/enum";

export type Image = Entity & Spatial & Size & {
    kind: EntityKind.Image;
    assetId: number | null;
};