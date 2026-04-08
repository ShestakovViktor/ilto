export abstract class Action<T = void> {
    abstract exec(): T | Promise<T>;

    abstract undo(): void | Promise<void>;

    abstract getLogMessage(): string;

    abstract getLogData(): {[key: string]: unknown};
}