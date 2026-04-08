import {Action} from "./Action";

export class Script<T = void> {
    private queue: Action<unknown>[] = [];

    constructor(
        private script: (
            exec: <R>(cmd: Action<R>) => Promise<R>
        ) => Promise<T>
    ) {}

    async exec() {
        const exec = async <R>(action: Action<R>): Promise<R> => {
            const result = await action.exec();
            this.queue.push(action);
            return result;
        };

        try {
            return await this.script(exec);
        }
        catch (error) {
            await this.undo();
            throw error;
        }
    }

    async undo() {
        // Реверс в обратном порядке — это правильно
        for (const cmd of [...this.queue].reverse()) {
            await cmd.undo();
        }
        this.queue = []; // Очищаем после отката
    }

    getLogMessage() { return "Running script..."; }

    getLogData() { return {}; }
}
