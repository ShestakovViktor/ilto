export abstract class Action<T = void> {
	abstract name: string;

	payload?: Record<string, unknown>;

	abstract exec(): T | Promise<T>;

	abstract undo(): void | Promise<void>;
}

