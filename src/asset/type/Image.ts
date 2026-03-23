import {Asset} from "@src/asset/type";
import {AssetKind} from "@src/asset/enum";

export type Image = Asset & {
    kind: AssetKind.Image;
    meta: {
        footnote: string;
    };
};