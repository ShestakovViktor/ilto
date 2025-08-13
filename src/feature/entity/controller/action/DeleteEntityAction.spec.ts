import {Collection} from "@feature/store/model";
import {DeleteEntityAction} from "@feature/entity/controller/action";
import {Entity, Parent} from "@feature/entity/type";

describe("Delete Entity Action", () => {
    let collection: Collection<Entity | Parent>;
    let parent: Parent;
    let item: Parent;
    let gaper: Entity;
    let child: Entity;

    beforeEach(() => {
        parent = {id: 1, childIds: [2, 3], entityTypeId: 1};
        item = {id: 2, childIds: [4], entityTypeId: 1};
        gaper = {id: 3, entityTypeId: 1};
        child = {id: 4, entityTypeId: 1};

        collection = new Collection<Entity | Parent>({});

        collection.insert(parent);
        collection.insert(item);
        collection.insert(gaper);
        collection.insert(child);
    });

    it("should submit action", () => {
        const action = new DeleteEntityAction(collection, 2);
        action.submit();

        expect(collection.select(parent.id)).toHaveProperty("childIds", [3]);
        expect(collection.select(item.id)).toBeUndefined();
        expect(collection.select(child.id)).toBeUndefined();
    });

    it("should revert action", () => {
        const action = new DeleteEntityAction(collection, 2);
        action.submit();
        action.revert();

        expect(collection.select(parent.id)).toHaveProperty("childIds", [2, 3]);
        expect(collection.select(item.id)).toStrictEqual(item);
        expect(collection.select(child.id)).toStrictEqual(child);
    });

    it("should get action log message", () => {
        const action = new DeleteEntityAction(collection, 2);
        action.submit();
        expect(action.getLogMessage()).toEqual("delete entity");
    });

    it("should get action log data", () => {
        const action = new DeleteEntityAction(collection, 2);
        action.submit();
        expect(action.getLogData()).toStrictEqual({
            parentId: 1,
            entityId: 2,
            entity: {id: 2, childIds: [4], entityTypeId: 1},
            related: [{id: 4, entityTypeId: 1}],
        });
    });
});