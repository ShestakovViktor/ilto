import type {Entity} from "@src/core/type/entity";

export type Scale = {
	scaleX: number;
	scaleY: number;
};

export function isScale(entity: Entity): entity is Entity & Scale {
	return "scaleX" in entity && "scaleY" in entity;
}