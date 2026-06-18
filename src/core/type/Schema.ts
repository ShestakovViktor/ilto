import type {Entity} from "@src/core/type";
import type {Asset} from "@src/core/type";
import type {System, Config} from "@src/storage/type";

export type Schema = {
	system: System;
	config: Config;
	asset: Record<string, Asset>;
	entity: Record<string, Entity>;
};