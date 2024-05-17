import {Data, Entity, Type, Group, Asset, Param} from "@type";
import {Collection} from "@core";
import {ASSET, ENTITY, LAYER} from "@enum";

export class Store {
    private data!: Data;

    public config!: Collection<Param>;

    public asset!: Collection<Asset>;

    public assetType!: Collection<Type>;

    public entity!: Collection<Entity>;

    public entityType!: Collection<Type>;

    constructor(data?: Partial<Data>) {
        this.setData(data);
    }

    setData(data?: Partial<Data>): void {
        this.data = this.initData(data);
        this.config = new Collection<Param>(this.data.config);
        this.asset = new Collection<Asset>(this.data.asset);
        this.assetType = new Collection<Type>(this.data.assetType);
        this.entity = new Collection<Entity>(this.data.entity);
        this.entityType = new Collection<Type>(this.data.entityType);
    }

    getData(): Data {
        return this.data;
    }

    initData(params?: Partial<Data>): Data {
        const data: Data = {
            entityType: {
                [ENTITY.ENTITY.id]: ENTITY.ENTITY,
                [ENTITY.GROUP.id]: ENTITY.GROUP,
                [ENTITY.TILE.id]: ENTITY.TILE,
                [ENTITY.MARKER.id]: ENTITY.MARKER,
                [ENTITY.DECOR.id]: ENTITY.DECOR,
                [ENTITY.AREA.id]: ENTITY.AREA,
            },
            assetType: {
                [ASSET.ASSET.id]: ASSET.ASSET,
                [ASSET.IMAGE.id]: ASSET.IMAGE,
                [ASSET.PROP.id]: ASSET.PROP,
                [ASSET.FIGURE.id]: ASSET.FIGURE,
                [ASSET.MOTION.id]: ASSET.MOTION,
            },
            config: {
                1: {id: 1, name: "name", value:  "New project"},
                2: {id: 2, name: "width", value: 0},
                3: {id: 3, name: "height", value: 0},
            },
            entity: {
                1: {
                    id: 1,
                    entityTypeId: ENTITY.GROUP.id,
                    name: LAYER.ROOT,
                    childIds: [2, 3, 4],
                } as Group,
                2: {
                    id: 2,
                    entityTypeId: ENTITY.GROUP.id,
                    name: LAYER.MAP,
                    childIds: [],
                } as Group,
                3: {
                    id: 3,
                    entityTypeId: ENTITY.GROUP.id,
                    name: LAYER.OVERLAY,
                    childIds: [],
                } as Group,
                4: {
                    id: 4,
                    entityTypeId: ENTITY.GROUP.id,
                    name: LAYER.STYLE,
                    childIds: [],
                } as Group,
            },
            asset: {},
        };

        return Object.assign(data, params);
    }
}