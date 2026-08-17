import type {Entity} from "@src/core/type/entity";
import type {
	Rotation,
	Scale,
	Size,
	Spatial,
	Visual,
	Anchor,
} from "@src/core/type/property";
import type {EntityKind} from "@src/core/enum";

export type Image = Entity
	& Spatial
	& Anchor
	& Size
	& Rotation
	& Scale
	& Visual
	& {
		kind: EntityKind.Image;
	};
