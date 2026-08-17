import type {Entity} from "@src/core/type/entity";
import type {EntityKind} from "@src/core/enum";

export type Footnote = Entity & {
	kind: EntityKind.Footnote;
	text: string;
};