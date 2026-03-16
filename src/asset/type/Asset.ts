import {AssetKind} from "@src/asset/enum";

export type Asset = {
    id: number;
    kind: AssetKind;
    size: number;
    mime: string;

    name: string;
    path: string;
};