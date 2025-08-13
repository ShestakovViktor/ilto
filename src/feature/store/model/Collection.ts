import {createStore, SetStoreFunction, StoreSetter, unwrap} from "solid-js/store";

export class Collection<U extends {id: number}> {
    public items: {[key: number]: U};

    private setItem: SetStoreFunction<{[key: number]: U}>;

    constructor(data: {[key: number]: U}) {
        const [items, setItem] = createStore(data);
        this.items = items;
        this.setItem = setItem;
    }

    private genId(): number {
        let id = 1;
        while (id in this.items) id++;
        return id;
    }

    select<T extends U = U>(id: number): Readonly<T> | undefined {
        return this.items[id] as T | undefined;
    }

    create<T extends U = U>(data: Omit<T, "id">): T {
        const id = this.genId();
        this.setItem(id, {...data, id} as T);
        return this.items[id] as T;
    }

    insert<T extends U = U>(data: T): T {
        if (data.id in this.items) throw new Error();
        this.setItem(data.id, data);
        return this.items[data.id] as T;
    }

    update<T extends U = U>(id: number, data: Partial<T>): U {
        this.setItem(id, data as StoreSetter<U, [number]>);
        return this.items[id];
    }

    delete<T extends U = U>(id: number): T {
        const item = this.select<T>(id);
        if (!item) throw new Error();
        this.setItem(id, undefined!);
        return unwrap(item);
    }

    selectAll<T extends U = U>(): T[] {
        const result: T[] = [];
        for (const itemId in this.items) {
            const item = this.items[itemId];
            result.push(item as T);
        }
        return result;
    }

    selectContains<T extends U>(
        prop: keyof T,
        value: unknown
    ): T | undefined {
        return Object.values(this.items).find(item => {
            const propertyValue = (item as T)[prop];
            return Array.isArray(propertyValue)
                && propertyValue.includes(value);
        }) as T | undefined;
    }

    selectRelated<T extends U = U>(id: number, field: keyof T): number[] {
        const item = this.select<T>(id);

        if (!item || !Array.isArray(item[field])) return [];

        const result = [];

        for (const id of item[field]) {
            result.push(id, ...this.selectRelated(id, field));
        }

        return result;
    }

    selectByParams<T extends U = U>(params: {[key: string]: unknown}): T[] {
        const result: T[] = [];
        for (const itemId in this.items) {
            const item = this.items[itemId];

            for (const prop in params) {
                if (!(prop in item)) break;
                if (params[prop] == (item as typeof params)[prop]) {
                    result.push(item as T);
                }
            }
        }
        return result;
    }
}