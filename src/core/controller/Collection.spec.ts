import {Collection} from "@src/storage/controller";

type Data = {
    id: number;
    label: string;
    childIds?: number[];
};

describe("Collection", () => {
    let collection: Collection<Data>;
    let data: {[key: number]: Data};

    beforeEach(() => {
        data = {
            1: {id: 1, label: "first", childIds: [2, 3]},
            2: {id: 2, label: "second", childIds: [4]},
            3: {id: 3, label: "thrird"},
            4: {id: 4, label: "forth"},
        };
        collection = new Collection(data);
    });

    it("should select item by id from colletion", () => {
        const item = collection.select(2);
        expect(item).toStrictEqual(data[2]);
    });

    it("should create item in colletion", () => {
        const result = collection.create({label: "fifth"});
        const item = collection.select(5);
        expect(result).toStrictEqual(item);
    });

    it("should insert item into collection", () => {
        const result = collection.insert({id: 5, label: "fifth"});
        const item = collection.select(5);
        expect(result).toStrictEqual(item);
    });

    it("should throw error when inserting item with existing id into collection", () => {
        expect(() => collection.insert({id: 1, label: "first"})).toThrow();
    });

    it("should update item in collection", () => {
        const data = {label: "second item"};
        collection.update(2, data);
        const item = collection.select(2);
        if (!item) throw new Error();
        expect(item.label).toEqual(data.label);
    });

    it("should delete item in collection", () => {
        let item: Data | undefined;

        item = collection.delete(1);
        expect(item).toStrictEqual({id: 1, childIds: [2, 3], label: "first"});

        item = collection.select(1);
        expect(item).toBeUndefined();
    });

    it("should select related items from collection", () => {
        const relatedIds = collection.selectRelated(1, "childIds");
        expect(relatedIds).toStrictEqual([2, 4, 3]);
    });
});