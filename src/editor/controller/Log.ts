import type {LogRec as LogRecord} from "../type";

export class Log {
	private buffer: LogRecord[] = [];

	log(record: LogRecord): void {
		this.buffer.push(record);
		console.log(record);
	}

	logs(): LogRecord[] {
		return this.buffer;
	}
}