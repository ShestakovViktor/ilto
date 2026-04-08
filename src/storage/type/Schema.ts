import {Attribute} from "@src/storage/type";
import {Entity} from "@src/core/type";
import {Asset} from "@src/core/type";

export type Schema = {
    system: {[key: string]: Attribute};
    config: {[key: string]: Attribute};
    asset: {[key: string]: Asset};
    entity: {[key: string]: Entity};
};