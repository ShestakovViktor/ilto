export class Action<T> {
    execute(): T {
        throw new Error("implement me");
    }

    revert(): void {
        throw new Error("implement me");
    }

    getLogMessage(): string {
        return "not implemented";
    }

    getLogData(): {[key: string]: unknown} {
        return {};
    }
}