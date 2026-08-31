import type {Entity} from "@src/storage/type/entity";
import type {Parent, Size, Spatial} from "@src/storage/type/property";
import type {EntityKind} from "@src/storage/enum";

export type Marker = Entity & Spatial & Size & Parent & {
	kind: EntityKind.Marker;
	propId: number | null;
};
