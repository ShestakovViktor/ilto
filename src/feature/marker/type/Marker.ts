import {Entity, Parent, Size, Spatial} from "@feature/entity/type";

export type Marker = Entity & Spatial & Size & Parent & {
    propId: number | null;
};