import type {Entity} from "@src/core/type";
import type {Config, System, Schema, Asset} from "@src/core/type";
import {Collection} from "@src/core/controller";

export class Storage {
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
			entity: {},
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