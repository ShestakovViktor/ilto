export abstract class Action<T = void> {
    abstract submit(): T;

    abstract revert(): void;

    abstract getLogMessage(): string;

    abstract getLogData(): {[key: string]: unknown};
}