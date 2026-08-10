import {EntityKind} from "@src/core/enum";
import type {Storage} from "@src/core/controller";
import type {Group} from "@src/core/type";

export function initProject(
	storage: Storage,
	params: {
		name: string;
		width: number;
		height: number;
	}
): void {
	storage.initData(params);

	storage.entity.insert<Group>({
		id: 1,
		kind: EntityKind.Group,
		prop: [],
		childIds: [],
		x: 0,
		y: 0,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
		name: "",
	});
}