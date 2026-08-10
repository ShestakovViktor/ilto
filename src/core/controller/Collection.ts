type Base = {
	[key: string]: unknown;
	id: number;
};

export class Collection<U extends Base> {
	private items: Map<number, U>;

	constructor(data: Record<number | string, U> | Map<number, U> | U[]) {
		if (data instanceof Map) {
			this.items = new Map(data);
		}
		else if (Array.isArray(data)) {
			this.items = new Map(data.map(item => [item.id, item]));
		}
		else {
			this.items = new Map(
				Object.entries(data).map(([key, value]) => [Number(key), value])
			);
		}
	}

	private genId(): number {
		let id = 1;
		while (this.items.has(id)) id++;
		return id;
	}

	unwrap(): Record<string, U> {
		return Object.fromEntries(this.items);
	}

	select<T extends U = U>(id: number): Readonly<T> | undefined {
		return this.items.get(id) as T | undefined;
	}

	filter<T extends U = U>(
		criteria: Record<string, unknown>
	): Readonly<T>[] {
		const result: T[] = [];
		for (const item of this.items.values()) {
			const matches = Object.entries(criteria).every(([key, value]) => {
				return item[key] === value;
			});
			if (matches) result.push(item as T);
		}
		return result;
	}

	create<T extends U = U>(data: Omit<T, "id">): T {
		const id = this.genId();
		const newItem = {...data, id} as T;
		this.items.set(id, newItem);
		return newItem;
	}

	insert<T extends U = U>(data: T): T {
		if (this.items.has(data.id)) throw new Error(`Item with id ${data.id} already exists`);
		this.items.set(data.id, data);
		return data;
	}

	update<T extends U = U>(id: number, data: Partial<T>): U {
		const item = this.items.get(id);
		if (!item) throw new Error(`Item with id ${id} not found`);
		Object.assign(item, data as T);
		return item;
	}

	delete<T extends U = U>(id: number): T {
		const item = this.select<T>(id);
		if (!item) throw new Error(`Item with id ${id} not found`);
		this.items.delete(id);
		return {...item};
	}

	selectAll<T extends U = U>(): T[] {
		const result: T[] = [];
		for (const item of this.items.values()) {
			result.push(item as T);
		}
		return result;
	}

	selectContains<T extends U>(
		prop: keyof T,
		value: unknown
	): T | undefined {
		for (const item of this.items.values()) {
			const propertyValue = (item as T)[prop];
			if (Array.isArray(propertyValue) && propertyValue.includes(value)) {
				return item as T;
			}
		}
		return undefined;
	}

	selectRelated<T extends U = U>(id: number, field: keyof T): number[] {
		const item = this.select<T>(id);

		if (!item || !Array.isArray(item[field])) return [];

		const result: number[] = [];

		for (const childId of item[field]) {
			result.push(childId, ...this.selectRelated(childId, field));
		}

		return result;
	}

	// 7. Исправлена логика и типизация поиска по параметрам
	selectByParams<T>(params: Record<string, unknown>): T[] {
		const result: T[] = [];
		for (const item of this.items.values()) {
			let isMatch = true;
			for (const prop in params) {
				if (!(prop in item) || params[prop] !== (item as Record<string, unknown>)[prop]) {
					isMatch = false;
					break;
				}
			}
			if (isMatch) {
				result.push(item as unknown as T);
			}
		}
		return result;
	}
}
