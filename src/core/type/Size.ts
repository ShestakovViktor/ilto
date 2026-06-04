import {Entity} from "@src/core/type";

export type Size = {
    w: number;
    h: number;
};

export function isSize(entity: Entity): entity is Entity & Size {
    return "width" in entity && "height" in entity;
}