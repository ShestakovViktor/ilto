import {Asset} from "@src/core/type";
import {AssetKind} from "@src/core/enum";

export type Keyframe = Asset & {
    kind: AssetKind.Keyframe;
    meta: {
        class: string;
    };
};