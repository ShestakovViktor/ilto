import {Entity} from "@src/entity/type";
import {Schema, Type, Attribute} from "@src/shared/type";
import {Collection} from "@src/shared/controller";
import {Asset} from "@src/asset/type";
import {Accessor, Setter, createSignal} from "solid-js";
import {ASSET_TYPE} from "@src/asset/enum";
import {SYSTEM_OPTION, CONFIG_OPTION} from "@src/editor/enum";
import {ENTITY_TYPE, DISPLAY_OPTION} from "@src/entity/enum";

type Data<T extends {[key: string]: {[key: string]: {id: number}}}> = {
    [K in keyof T]: Collection<T[K][string]>;
};

export class Database {
    data: Data<Schema>;

    reloaded: Accessor<undefined>;

    reload: Setter<undefined>;

    constructor(data?: Schema) {
        if (!data) data = this.initData();
        this.data = this.loadData(data);

        const reloadSignal = createSignal(undefined, {equals: false});
        this.reloaded = reloadSignal[0];
        this.reload = reloadSignal[1];
    }

    setData(data: Schema) {
        this.data = this.loadData(data);
        this.reload();
    }

    reInitData(partialData: Partial<Schema>): void {
        this.data = this.loadData(this.deepMerge(this.initData(), partialData));
    }

    private loadData(data: Schema): Data<Schema> {
        return {
            system: new Collection<Attribute>(data.system),
            config: new Collection<Attribute>(data.config),
            displayOption: new Collection<Type>(data.displayOption),
            entityType: new Collection<Type>(data.entityType),
            entity: new Collection<Entity>(data.entity),
            assetType: new Collection<Type>(data.assetType),
            asset: new Collection<Asset>(data.asset),
        };
    }

    extract(): Schema {
        return {
            system: this.data.system.unwrap(),
            config: this.data.config.unwrap(),
            displayOption: this.data.displayOption.unwrap(),
            entityType: this.data.entityType.unwrap(),
            entity: this.data.entity.unwrap(),
            assetType: this.data.assetType.unwrap(),
            asset: this.data.asset.unwrap(),
        };
    }

    private initData(): Schema {
        return {
            system: {
                1: {id: 1, name: SYSTEM_OPTION.PACKAGE, string: "0.0.1"},
                2: {id: 2, name: SYSTEM_OPTION.SCHEMA, number: 1},
            },
            config: {
                1: {id: 1, name: CONFIG_OPTION.NAME, string: ""},
                2: {id: 2, name: CONFIG_OPTION.WIDTH, number: 0},
                3: {id: 3, name: CONFIG_OPTION.HEIGHT, number: 0},
                4: {id: 4, name: CONFIG_OPTION.MIN_SCALE, number: 0.5},
                5: {id: 5, name: CONFIG_OPTION.MAX_SCALE, number: 2},
            },
            entityType: {
                1: {id: 1, name: ENTITY_TYPE.ENTITY},
                2: {id: 2, name: ENTITY_TYPE.LAYER},
                3: {id: 3, name: ENTITY_TYPE.TILE},
                4: {id: 4, name: ENTITY_TYPE.FOOTNOTE},
                5: {id: 5, name: ENTITY_TYPE.MARKER},
                6: {id: 6, name: ENTITY_TYPE.DECOR},
                7: {id: 7, name: ENTITY_TYPE.AREA},
            },
            assetType: {
                1: {id: 1, name: ASSET_TYPE.ASSET},
                2: {id: 2, name: ASSET_TYPE.IMAGE},
                3: {id: 3, name: ASSET_TYPE.PROP},
                4: {id: 4, name: ASSET_TYPE.FIGURE},
                5: {id: 5, name: ASSET_TYPE.MOTION},
            },
            displayOption: {
                1: {id: 1, name: DISPLAY_OPTION.MOVABLE},
                2: {id: 2, name: DISPLAY_OPTION.SCALABLE},
            },
            entity: {},
            asset: {},
        };
    }

    private deepMerge<T extends object>(
        target: T,
        source: Partial<T>
    ): T {
        for (const key in source) {
            if (
                key in target
                && target[key] instanceof Object
                && source[key] instanceof Object
            ){
                Object.assign(
                    target[key],
                    this.deepMerge(
                        target[key],
                        source[key] as Partial<T[keyof T]>
                    )
                );
            }
            else {
                Object.assign(target, source);
            }
        }
        return target;
    }
}