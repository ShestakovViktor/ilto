import {LogRecord} from "@src/editor/type";
import {uuid} from "@src/utility/service/uuid";
import {LogLevel} from "@src/editor/enum";

export class LogManager {
    private buffer: LogRecord[] = [];

    log(
        level: LogLevel,
        message: string,
        params?: {[key: string]: unknown}
    ): void {
        const record: LogRecord = {
            id: uuid(),
            timestamp: Date.now(),
            level,
            message,
            params,
        };

        this.buffer.push(record);
    }

    logs(): LogRecord[] {
        return this.buffer;
    }
}