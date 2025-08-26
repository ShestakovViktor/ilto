import {Entity} from "@src/entity/type";

export type Parent = Entity & {
    childIds: number[];
};