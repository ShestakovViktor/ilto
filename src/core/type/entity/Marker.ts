import type {Entity} from "@src/core/type/entity";
import type {Parent, Size, Spatial} from "@src/core/type/property";
import type {EntityKind} from "@src/core/enum";

export type Marker = Entity & Spatial & Size & Parent & {
	kind: EntityKind.Marker;
	propId: number | null;
};
