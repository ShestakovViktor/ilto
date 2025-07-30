import {createStore, SetStoreFunction, StoreSetter} from "solid-js/store";

export class Collection<U extends {id: number}> {
    public data: {[key: number]: U};

    private setData: SetStoreFunction<{[key: number]: U}>;

    constructor(data: {[key: number]: U}) {
        const [entity, setEntity] = createStore(data);
        this.data = entity;
        this.setData = setEntity;
    }

    private genId(): number {
        let id = 1;
        while (id in this.data) id++;
        return id;
    }

    add<T extends U = U>(data: Partial<T>): T {
        const id = this.genId();
        this.setData(id, {...data, id} as T);
        return this.data[id] as T;
    }

    set<T extends U = U>(id: number, data: Partial<T>): void {
        this.setData(id, data as StoreSetter<U, [number]>);
    }

    del(id: number): void {
        this.setData(id, undefined!);
    }

    getContains<T extends U>(
        prop: keyof T,
        value: unknown
    ): T | undefined {
        return Object.values(this.data).find(item => {
            const propertyValue = (item as T)[prop];
            return Array.isArray(propertyValue)
                && propertyValue.includes(value);
        }) as T | undefined;
    }

    getAll<T extends U = U>(): T[] {
        const result: T[] = [];
        for (const itemId in this.data) {
            const item = this.data[itemId];
            result.push(item as T);
        }
        return result;
    }

    getById<T extends U = U>(id: number): T | undefined {
        return this.data[id] as T | undefined;
    }

    getByParams<T extends U = U>(params: {[key: string]: unknown}): T[] {
        const result: T[] = [];
        for (const itemId in this.data) {
            const item = this.data[itemId];

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