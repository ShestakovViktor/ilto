import type {Entity} from "@src/storage/type/entity";
import type {EntityKind} from "@src/storage/enum";

export type Footnote = Entity & {
	kind: EntityKind.Footnote;
	text: string;
};