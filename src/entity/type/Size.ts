import {Entity} from "./Entity";

export type Size = Entity & {
    width: number;
    height: number;
};

export function isSize(entity: Entity): entity is Size {
    return "width" in entity && "height" in entity;
}