import {Asset} from "@src/asset/type";
import {AssetKind} from "@src/asset/enum";

export type Keyframe = Asset & {
    kind: AssetKind.Keyframe;
    meta: {
        class: string;
    };
};