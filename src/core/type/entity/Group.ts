import type {Entity} from "@src/core/type/entity";
import type {Spatial, Parent, Rotation, Scale} from "@src/core/type/property";

export type Group = Entity & Parent & Spatial & Rotation & Scale;

