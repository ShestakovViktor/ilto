import {Entity, Parent, Size, Spatial} from "@src/core/type";
import {EntityKind} from "@src/core/enum";

export type Marker = Entity & Spatial & Size & Parent & {
    kind: EntityKind.Marker;
    propId: number | null;
};