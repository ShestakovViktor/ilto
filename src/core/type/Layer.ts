import {Entity, Spatial, Parent} from "@src/core/type";

export type Layer = Entity & Spatial & Parent & {
    name: string;
};
