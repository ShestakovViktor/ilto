import {Entity} from "@src/core/type";
import {Schema, Attribute} from "@src/storage/type";
import {Collection} from "@src/storage/controller";
import {Asset} from "@src/core/type";
import {Accessor, Setter, createSignal} from "solid-js";
import {SystemOption, ConfigOption} from "@src/editor/enum";

type Data<T extends {[key: string]: {[key: string]: {id: number}}}> = {
    [K in keyof T]: Collection<T[K][string]>;
};

export class Storage {
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
            entity: new Collection<Entity>(data.entity),
            asset: new Collection<Asset>(data.asset),
        };
    }

    extract(): Schema {
        return {
            system: this.data.system.unwrap(),
            config: this.data.config.unwrap(),
            entity: this.data.entity.unwrap(),
            asset: this.data.asset.unwrap(),
        };
    }

    private initData(): Schema {
        return {
            system: {
                1: {id: 1, name: SystemOption.Package, string: "0.0.1"},
                2: {id: 2, name: SystemOption.Schema, number: 1},
            },
            config: {
                1: {id: 1, name: ConfigOption.Name, string: ""},
                2: {id: 2, name: ConfigOption.Width, number: 0},
                3: {id: 3, name: ConfigOption.Height, number: 0},
                4: {id: 4, name: ConfigOption.MinScale, number: 0.5},
                5: {id: 5, name: ConfigOption.MaxScale, number: 2},
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