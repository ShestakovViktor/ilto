import type {
	Area,
	Decor,
	Footnote,
	Group,
	Marker,
	Tile,
} from "@src/core/type/entity";

export type Entities = Group
	| Tile
	| Marker
	| Decor
	| Area
	| Footnote;