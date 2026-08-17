export abstract class Action<T = void> {
	abstract name: string;

	protected payload?: Record<string, unknown>;

	abstract exec(): T | Promise<T>;

	abstract undo(): void | Promise<void>;
}

