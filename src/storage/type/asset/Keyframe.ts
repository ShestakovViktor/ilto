import type {Asset} from "@src/storage/type/asset";
import type {AssetKind} from "@src/storage/enum";

export type Keyframe = Asset & {
	kind: AssetKind.Keyframe;
	meta: {
		class: string;
	};
};
