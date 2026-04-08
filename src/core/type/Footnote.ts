import {Entity} from "@src/core/type";
import {EntityKind} from "@src/core/enum";

export type Footnote = Entity & {
    kind: EntityKind.Footnote;
    text: string;
};