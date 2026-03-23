import {Entity, Size, Spatial} from "@src/entity/type";
import {EntityKind} from "@src/entity/enum";

export type Area = Entity & Spatial & Size & {
    kind: EntityKind.Area;
    points: {x: number; y: number}[];

    footnoteId: number | null;
};