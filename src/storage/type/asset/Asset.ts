import type {AssetKind} from "@src/storage/enum";

export type Asset = {
	id: number;
	kind: AssetKind;
	size: number;
	mime: string;
	path: string;
	name: string;
};