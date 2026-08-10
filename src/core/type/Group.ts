import type {Entity, Spatial, Parent, Rotation, Scale} from "@src/core/type";

export type Group = Entity & Parent & Spatial & Rotation & Scale & {
	name: string;
};

