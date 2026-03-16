import {Action, LogManager} from "@src/editor/controller";
import {LogLevel} from "@src/editor/enum";

export class ActionManager {

    private queue: Action<unknown>[] = [];

    private cursor = this.queue.length;

    private logManager: LogManager;

    constructor(logManager: LogManager) {
        this.logManager = logManager;
    }

    execute<T>(action: Action<T>): T {
        this.queue[this.cursor] = action;
        this.cursor++;

        const result = action.submit();

        this.logManager.log(
            LogLevel.Info,
            action.getLogMessage(),
            action.getLogData()
        );

        return result;
    }

    append<T>(action: Action<T>): void {
        this.queue[this.cursor] = action;
        this.cursor++;

        this.logManager.log(
            LogLevel.Info,
            action.getLogMessage(),
            action.getLogData()
        );
    }

    undo(): void {
        if (this.cursor == 0) return;
        this.cursor--;
        this.queue[this.cursor].revert();
    }

    redo(): void {
        if (this.cursor == this.queue.length) return;
        this.queue[this.cursor].submit();
        this.cursor++;
    }
}