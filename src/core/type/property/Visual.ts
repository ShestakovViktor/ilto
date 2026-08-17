import type {Entity} from "@src/core/type/entity";

export type Visual = {
	assetId: number;
};

export function isVisual(entity: Entity): entity is Entity & Visual {
	return "assetId" in entity;
}