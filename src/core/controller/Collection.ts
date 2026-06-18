type Base = {
	[key: string]: unknown;
	id: number;
};

export class Collection<U extends Base> {
	public items: Record<string, U>;

	public constructor(data: Record<string, U>) {
		this.items = {...data};
	}

	private genId(): number {
		let id = 1;
		while (id in this.items) id++;
		return id;
	}

	public unwrap(): Record<string, U> {
		return {...this.items};
	}

	public select<T extends U = U>(id: number): Readonly<T> | undefined {
		return this.items[id] as T | undefined;
	}

	public filter<T extends U = U>(
		criteria: Record<string, unknown>
	): Readonly<T>[] {
		return Object.values(this.items).filter(item => {
			return Object.entries(criteria).every(([key, value]) => {
				return item[key] === value;
			});
		}) as T[];
	}

	public create<T extends U = U>(data: Omit<T, "id">): T {
		const id = this.genId();
		this.items[id] = {...data, id} as T;
		return this.items[id] as T;
	}

	public insert<T extends U = U>(data: T): T {
		if (data.id in this.items) throw new Error();
		this.items[data.id] = data;
		return this.items[data.id] as T;
	}

	public update<T extends U = U>(id: number, data: Partial<T>): U {
		Object.assign(this.items[id], data as T);
		return this.items[id];
	}

	public delete<T extends U = U>(id: number): T {
		const item = this.select<T>(id);
		if (!item) throw new Error();
		delete this.items[id];
		return {...item};
	}

	public selectAll<T extends U = U>(): T[] {
		const result: T[] = [];
		for (const itemId in this.items) {
			const item = this.items[itemId];
			result.push(item as T);
		}
		return result;
	}

	public selectContains<T extends U>(
		prop: keyof T,
		value: unknown
	): T | undefined {
		return Object.values(this.items).find(item => {
			const propertyValue = (item as T)[prop];
			return Array.isArray(propertyValue)
                && propertyValue.includes(value);
		}) as T | undefined;
	}

	public selectRelated<T extends U = U>(id: number, field: keyof T): number[] {
		const item = this.select<T>(id);

		if (!item || !Array.isArray(item[field])) return [];

		const result = [];

		for (const id of item[field]) {
			result.push(id, ...this.selectRelated(id, field));
		}

		return result;
	}

	public selectByParams<T>(params: Record<string, unknown>): T[] {
		const result: T[] = [];
		for (const itemId in this.items) {
			const item = this.items[itemId];

			for (const prop in params) {
				if (!(prop in item)) break;
				if (params[prop] == (item as typeof params)[prop]) {
					result.push(item as unknown as T);
				}
			}
		}
		return result;
	}
}