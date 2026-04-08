import {EntityKind, EntityProp} from "@src/core/enum";

export type Entity = {
    id: number;
    kind: EntityKind;
    prop: EntityProp[];
};