import type {Entity} from "@src/core/type/entity";
import type {Dynamic, Size, Spatial, Visual} from "@src/core/type/property";

export type Decor = Entity & Spatial & Size & Visual & Dynamic;