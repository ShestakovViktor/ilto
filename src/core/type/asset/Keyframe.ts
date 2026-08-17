import type {Asset} from "@src/core/type/asset";
import type {AssetKind} from "@src/core/enum";

export type Keyframe = Asset & {
	kind: AssetKind.Keyframe;
	meta: {
		class: string;
	};
};
