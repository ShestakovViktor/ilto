import {AssetKind} from "@src/core/enum";

export type Asset = {
    id: number;
    kind: AssetKind;
    size: number;
    mime: string;
    path: string;
    name: string;
};