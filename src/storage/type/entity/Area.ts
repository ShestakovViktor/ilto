import type {Entity} from "@src/storage/type/entity";
import type {Size, Spatial} from "@src/storage/type/property";
import type {EntityKind} from "@src/storage/enum";

export type Area = Entity & Spatial & Size & {
	kind: EntityKind.Area;
	points: {x: number; y: number}[];

	footnoteId: number | null;
};