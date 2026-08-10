import {Collection} from "@src/storage/controller";
import {DeleteEntityAction} from "@src/editor/action";
import type {Entity, Parent} from "@src/core/type";
import {EntityKind} from "@src/core/enum";

describe("Delete Entity Action", () => {
	let collection: Collection<Entity | Entity & Parent>;
	let parent: Entity & Parent;
	let item: Entity & Parent;
	let gaper: Entity;
	let child: Entity;

	beforeEach(() => {
		parent = {id: 1, childIds: [2, 3], kind: EntityKind.Group, prop: []};
		item = {id: 2, childIds: [4], kind: EntityKind.Tile, prop: []};
		gaper = {id: 3, kind: EntityKind.Footnote, prop: []};
		child = {id: 4, kind: EntityKind.Marker, prop: []};

		collection = new Collection<Entity | Entity & Parent>({});

		collection.insert(parent);
		collection.insert(item);
		collection.insert(gaper);
		collection.insert(child);
	});

	it("should submit action", () => {
		const action = new DeleteEntityAction(collection, 2);
		action.exec();

		expect(collection.select(parent.id)).toHaveProperty("childIds", [3]);
		expect(collection.select(item.id)).toBeUndefined();
		expect(collection.select(child.id)).toBeUndefined();
	});

	it("should revert action", () => {
		const action = new DeleteEntityAction(collection, 2);
		action.exec();
		action.undo();

		expect(collection.select(parent.id)).toHaveProperty("childIds", [2, 3]);
		expect(collection.select(item.id)).toStrictEqual(item);
		expect(collection.select(child.id)).toStrictEqual(child);
	});

	it("should get action log message", () => {
		const action = new DeleteEntityAction(collection, 2);
		action.exec();
		expect(action.getLogMessage()).toEqual("delete entity");
	});

	it("should get action log data", () => {
		const action = new DeleteEntityAction(collection, 2);
		action.exec();
		expect(action.getLogData()).toStrictEqual({
			parentId: 1,
			entityId: 2,
			entity: {id: 2, childIds: [4], kind: EntityKind.Tile},
			related: [{id: 4, kind: EntityKind.Tile}],
		});
	});
});