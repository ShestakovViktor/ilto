import type {Entity} from "@src/core/type";

export type Visual = {
	assetId: number;
};

export function isVisual(entity: Entity): entity is Entity & Visual {
	return "assetId" in entity;
}