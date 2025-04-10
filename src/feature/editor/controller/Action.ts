export class Action<T> {
    message(): string {
        throw new Error("implement me");
    }

    execute(): T {
        throw new Error("implement me");
    }

    revert(): void {
        throw new Error("implement me");
    }
}