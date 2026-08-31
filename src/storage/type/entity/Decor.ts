import type {Entity} from "@src/storage/type/entity";
import type {Dynamic, Size, Spatial, Visual} from "@src/storage/type/property";

export type Decor = Entity & Spatial & Size & Visual & Dynamic;