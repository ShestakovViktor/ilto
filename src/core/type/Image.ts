import {Entity, Size, Spatial} from "@src/core/type";
import {EntityKind} from "@src/core/enum";

export type Image = Entity & Spatial & Size & {
    kind: EntityKind.Image;
    assetId: number;
};