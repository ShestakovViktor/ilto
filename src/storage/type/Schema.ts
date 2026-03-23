import {Attribute} from "@src/storage/type";
import {Entity} from "@src/entity/type";
import {Asset} from "@src/asset/type";

export type Schema = {
    system: {[key: string]: Attribute};
    config: {[key: string]: Attribute};
    asset: {[key: string]: Asset};
    entity: {[key: string]: Entity};
};