import {Entity} from "@src/entity/type";

export type Parent = {
    childIds: number[];
};

export function isParent(entity: Entity): entity is Entity & Parent {
    return "childIds" in entity;
}