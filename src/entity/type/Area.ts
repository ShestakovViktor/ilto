import {Entity, Size, Spatial} from "@src/entity/type";

export type Area = Entity & Spatial & Size & {
    points: {x: number; y: number}[];

    footnoteId: number | null;
};