import type {Entity} from "@src/storage/type/entity";

export type Child = {
	parentId: number;
};

export function isChild(entity: Entity): entity is Entity & Child {
	return "parentId" in entity;
}