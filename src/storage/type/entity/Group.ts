import type {Entity} from "@src/storage/type/entity";
import type {Spatial, Parent, Rotation, Scale} from "@src/storage/type/property";

export type Group = Entity & Parent & Spatial & Rotation & Scale;

