import {Entity, Spatial, Parent} from "@src/entity/type";

export type Layer = Entity & Spatial & Parent & {
    name: string;
    displayOptionIds: number[];
};
