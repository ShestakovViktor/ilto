import type {Asset} from "@src/storage/type/asset";
import type {AssetKind} from "@src/storage/enum";

export type Graphics = Asset & {
	kind: AssetKind.Graphics;
	meta: {
		footnote: string;
	};
};
