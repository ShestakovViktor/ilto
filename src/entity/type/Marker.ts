import {Entity, Parent, Size, Spatial} from "@src/entity/type";

export type Marker = Entity & Spatial & Size & Parent & {
    propId: number | null;
};