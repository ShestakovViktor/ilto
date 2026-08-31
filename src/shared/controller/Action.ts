export abstract class Action<T = void> {
	abstract name: string;

	params?: Record<string, unknown>;

	abstract exec(): T | Promise<T>;

	abstract undo(): void | Promise<void>;
}

