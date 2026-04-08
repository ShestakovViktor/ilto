import {Action} from "@src/editor/action";
import {Log} from "@src/editor/controller";
import {LogLevel} from "@src/editor/enum";

export class Engine {
    private queue: Action<unknown>[] = [];

    private cursor = this.queue.length;

    private chain: Promise<unknown> = Promise.resolve();

    constructor(private log: Log) {}

    async exec<T>(action: Action<T>): Promise<T> {
        this.queue.splice(this.cursor);
        this.queue.push(action);
        this.cursor++;

        const task = async () => {
            const result = await action.exec();

            this.log.log(
                LogLevel.Info,
                action.getLogMessage(),
                action.getLogData()
            );

            return result;
        };

        const promise = this.chain.then(task);

        this.chain = promise.catch(err => {
            console.error("Action failed:", err);
        });

        return promise;
    }

    append<T>(action: Action<T>): void {
        this.queue[this.cursor] = action;
        this.cursor++;

        this.log.log(
            LogLevel.Info,
            action.getLogMessage(),
            action.getLogData()
        );
    }

    async undo(): Promise<void> {
        if (this.cursor == 0) return;

        this.cursor--;

        const action = this.queue[this.cursor];

        return this.chain
            .then(() => action.undo())
            .catch(err => {
                console.error("Undo failed:", err);
            });
    }

    async redo(): Promise<void> {
        if (this.cursor == this.queue.length) return;
        await this.queue[this.cursor].exec();
        this.cursor++;
    }
}
