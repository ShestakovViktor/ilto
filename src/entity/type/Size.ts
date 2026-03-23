import {Entity} from "@src/entity/type";

export type Size = {
    width: number;
    height: number;
};

export function isSize(entity: Entity): entity is Entity & Size {
    return "width" in entity && "height" in entity;
}