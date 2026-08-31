import type {Config, System, Schema} from "@src/storage/type";
import type {Entity, Group} from "@src/storage/type/entity";
import type {Asset} from "@src/storage/type/asset";
import {Collection} from "@src/storage/controller";
import {EntityKind} from "@src/storage/enum";

export class DataRepository {
	system: System;

	config: Config;

	entity: Collection<Entity>;

	asset: Collection<Asset>;

	constructor(data?: Schema) {
		const defaultData = data || this.genData();

		this.system = {...defaultData.system};
		this.config = {...defaultData.config};
		this.entity = new Collection<Entity>(defaultData.entity);
		this.asset = new Collection<Asset>(defaultData.asset);
	}

	private genData(): Schema {
		return {
			system: {package: "0.0.1", schema: 1},
			config: {name: "", width: 0, height: 0, minScale: 0.5, maxScale: 2},
			entity: {
				1: {
					id: 1,
					kind: EntityKind.Group,
					name: "root",
					prop: [],
					childIds: [2],
					x: 0,
					y: 0,
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
				} as Group,
				2: {
					id: 2,
					kind: EntityKind.Group,
					name: "first",
					prop: [],
					childIds: [3],
					x: 100,
					y: 100,
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
				} as Group,
				3: {
					id: 3,
					kind: EntityKind.Group,
					name: "second",
					prop: [],
					childIds: [],
					x: 100,
					y: 100,
					rotation: 0,
					scaleX: 1,
					scaleY: 1,
				} as Group,

			},
			asset: {},
		};
	}

	initData(config: Partial<Config>): void {
		const data = this.genData();
		Object.assign(data.config, config);
		this.setData(data);
	}

	setData(data: Schema): void {
		//TODO: Need to apply migrations here
		this.system = {...data.system};
		this.config = {...data.config};
		this.entity = new Collection<Entity>(data.entity);
		this.asset = new Collection<Asset>(data.asset);
	}

	getData(): Schema {
		return {
			system: {...this.system},
			config: {...this.config},
			entity: this.entity.unwrap(),
			asset: this.asset.unwrap(),
		};
	}
}