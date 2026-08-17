import type {Asset} from "@src/core/type/asset";
import type {AssetKind} from "@src/core/enum";

export type Graphics = Asset & {
	kind: AssetKind.Graphics;
	meta: {
		footnote: string;
	};
};
