export abstract class Action<T = void> {
	abstract name: string;

	payload?: Record<string, unknown>;

	abstract apply(): T | Promise<T>;

	abstract revert(): void | Promise<void>;
}

