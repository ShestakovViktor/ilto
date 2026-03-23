import {Entity} from "@src/entity/type";
import {EntityKind} from "@src/entity/enum";

export type Footnote = Entity & {
    kind: EntityKind.Footnote;
    text: string;
};