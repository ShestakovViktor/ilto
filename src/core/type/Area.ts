import {Entity, Size, Spatial} from "@src/core/type";
import {EntityKind} from "@src/core/enum";

export type Area = Entity & Spatial & Size & {
    kind: EntityKind.Area;
    points: {x: number; y: number}[];

    footnoteId: number | null;
};