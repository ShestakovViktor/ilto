import {Entity} from "./Entity";

export type Spatial = Entity & {
    x: number;
    y: number;
};

export function isSpatial(entity: Entity): entity is Spatial {
    return "x" in entity;
}