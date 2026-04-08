import {Asset} from "@src/core/type";
import {AssetKind} from "@src/core/enum";

export type Graphics = Asset & {
    kind: AssetKind.Graphics;
    meta: {
        footnote: string;
    };
};