import type {Action, Script} from "@src/shared/controller";
import type {ActionLog} from "@src/editor/controller";
import {LogKind} from "@src/editor/enum";

export class ActionEngine {
	private queue: (Action<unknown> | Script<unknown>)[] = [];

	private cursor = this.queue.length;

	private chain: Promise<unknown> = Promise.resolve();

	constructor(private log: ActionLog) {}

	async apply<T>(executable: Action<T> | Script<T>): Promise<T> {
		this.queue.splice(this.cursor);
		this.queue.push(executable);
		this.cursor++;

		const task = async (): Promise<T> => {
			const result = await executable.apply();

			const now = new Date();
			const log = "log" in executable ? executable.log : undefined;
			this.log.log({
				stamp: now.getTime(),
				time: now.toTimeString(),
				kind: LogKind.Info,
				source: executable.name,
				status: "success",
				message: `Success execute ${executable.name}`,
				payload: executable.payload,
				... log && {log},
			});

			return result;
		};

		const promise = this.chain.then(task);

		this.chain = promise.catch(err => {
			const log = "log" in executable ? executable.log : undefined;
			const now = new Date();
			this.log.log({
				stamp: now.getTime(),
				time: now.toTimeString(),
				kind: LogKind.Error,
				source: executable.name,
				payload: executable.payload,
				status: "failed",
				message: `Failed execute ${executable.name}`,
				error: err,
				... log && {log},
			});
		});

		return promise;
	}

	append<T>(action: Action<T>): void {
		this.queue[this.cursor] = action;
		this.cursor++;

		// this.log.log(
		// 	LogKind.Info,
		// 	action.getLogMessage(),
		// 	action.getLogData()
		// );
	}

	async revert(): Promise<void> {
		if (this.cursor == 0) return;

		this.cursor--;

		const action = this.queue[this.cursor];

		return this.chain
			.then(() => action.revert())
			.catch(err => {
				console.error("Undo failed:", err);
			});
	}

	async redo(): Promise<void> {
		if (this.cursor == this.queue.length) return;
		await this.queue[this.cursor].apply();
		this.cursor++;
	}
}
