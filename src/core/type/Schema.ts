import type {Entity} from "@src/core/type/entity";
import type {Asset} from "@src/core/type/asset";
import type {System, Config} from "@src/core/type";

export type Schema = {
	system: System;
	config: Config;
	asset: Record<string, Asset>;
	entity: Record<string, Entity>;
};