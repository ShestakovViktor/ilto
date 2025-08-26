import {Entity, Size, Spatial} from "@src/entity/type";

export type Tile = Entity & Spatial & Size & {
    imageId: number | null;
};
