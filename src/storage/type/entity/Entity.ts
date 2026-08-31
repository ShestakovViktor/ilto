import type {EntityKind, EntityProp} from "@src/storage/enum";

export type Entity = {
	id: number;
	kind: EntityKind;
	prop: EntityProp[];
	name: string;
};
