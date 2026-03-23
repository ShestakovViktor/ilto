import {Entity, Parent, Size, Spatial} from "@src/entity/type";
import {EntityKind} from "@src/entity/enum";

export type Marker = Entity & Spatial & Size & Parent & {
    kind: EntityKind.Marker;
    propId: number | null;
};