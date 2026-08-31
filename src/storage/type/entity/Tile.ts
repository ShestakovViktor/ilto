import type {Entity} from "@src/storage/type/entity";
import type {Size, Spatial} from "@src/storage/type/property";

export type Tile = Entity & Spatial & Size & {
	imageId: number | null;
};
