import {Entity, Size, Spatial} from "@src/core/type";

export type Tile = Entity & Spatial & Size & {
    imageId: number | null;
};
