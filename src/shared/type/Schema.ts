import {Type, Attribute} from "@src/shared/type";
import {Entity} from "@src/entity/type";
import {Asset} from "@src/asset/type";

export type Schema = {
    system: {[key: string]: Attribute};
    config: {[key: string]: Attribute};
    asset: {[key: string]: Asset};
    assetType: {[key: string]: Type};
    entity: {[key: string]: Entity};
    entityType: {[key: string]: Type};
    displayOption: {[key: string]: Type};
};