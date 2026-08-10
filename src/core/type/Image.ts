import type {
	Entity,
	Rotation,
	Scale,
	Size,
	Spatial,
	Visual,
	Anchor,
} from "@src/core/type";
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
