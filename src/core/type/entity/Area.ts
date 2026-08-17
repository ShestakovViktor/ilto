import type {Entity} from "@src/core/type/entity";
import type {Size, Spatial} from "@src/core/type/property";
import type {EntityKind} from "@src/core/enum";

export type Area = Entity & Spatial & Size & {
	kind: EntityKind.Area;
	points: {x: number; y: number}[];

	footnoteId: number | null;
};