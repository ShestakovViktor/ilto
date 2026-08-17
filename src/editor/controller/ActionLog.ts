import type {LogRec as LogRecord} from "../type";

export class ActionLog {
	private buffer: LogRecord[] = [];

	log(record: LogRecord): void {
		this.buffer.push(record);
		console.log(
			`%c[ActionLogger] ${record.source}`,
			"color: #990000; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
			record
		);
	}

	logs(): LogRecord[] {
		return this.buffer;
	}
}