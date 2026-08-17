import {Action} from "@src/core/library";
import {LogKind} from "@src/editor/enum";
import type {LogRec} from "@src/editor/type";

export abstract class Script<T = void> extends Action<T> {
	log: LogRec[] = [];

	protected abstract run(
		exec: <R>(cmd: Action<R>) => Promise<R>
	): Promise<T>;

	abstract override undo(): Promise<void>;

	async exec(): Promise<T> {
		const safeExec = async <R>(action: Action<R>): Promise<R> => {
			const result = await action.exec();
			const now = new Date();

			this.log.push({
				kind: LogKind.Info,
				source: action.name,
				status: "success",
				message: `Success execute ${action.name}`,
				payload: action.payload,
				time: now.toTimeString(),
				stamp: now.getTime(),
			});

			return result;
		};

		try {
			return await this.run(safeExec);
		}
		catch (error) {
			await this.undo();
			throw error;
		}
	}
}
