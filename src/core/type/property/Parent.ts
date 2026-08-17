import type {Entity} from "@src/core/type/entity";

export type Parent = {
	childIds: number[];
};

export function isParent(entity: Entity): entity is Entity & Parent {
	return "childIds" in entity;
}