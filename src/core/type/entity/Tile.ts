import type {Entity} from "@src/core/type/entity";
import type {Size, Spatial} from "@src/core/type/property";

export type Tile = Entity & Spatial & Size & {
	imageId: number | null;
};
