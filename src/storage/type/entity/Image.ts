import type {Entity} from "@src/storage/type/entity";
import type {
	Rotation,
	Scale,
	Size,
	Spatial,
	Visual,
	Pivot,
} from "@src/storage/type/property";
import type {EntityKind} from "@src/storage/enum";

export type Image = Entity
	& Spatial
	& Pivot
	& Size
	& Rotation
	& Scale
	& Visual
	& {
		kind: EntityKind.Image;
	};
