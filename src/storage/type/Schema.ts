import type {Entity} from "@src/storage/type/entity";
import type {Asset} from "@src/storage/type/asset";
import type {System, Config} from "@src/storage/type";

export type Schema = {
	system: System;
	config: Config;
	asset: Record<string, Asset>;
	entity: Record<string, Entity>;
};