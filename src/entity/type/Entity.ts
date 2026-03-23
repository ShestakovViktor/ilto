import {EntityKind, EntityProp} from "@src/entity/enum";

export type Entity = {
    id: number;
    kind: EntityKind;
    prop: EntityProp[];
};