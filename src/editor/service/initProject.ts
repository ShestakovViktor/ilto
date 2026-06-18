import {EntityKind} from "@src/core/enum";
import type {Storage} from "@src/core/controller";
import type {Layer} from "@src/core/type";

export function initProject(
	storage: Storage,
	params: {
		name: string;
		width: number;
		height: number;
	}
): void {
	storage.initData(params);

	storage.entity.insert<Layer>({
		id: 1,
		kind: EntityKind.Layer,
		prop: [],
		childIds: [],
		x: 0,
		y: 0,
		name: "",
	});
}