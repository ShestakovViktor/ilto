import {Action} from "@src/shared/controller";
import {LogKind} from "@src/editor/enum";
import type {LogRec} from "@src/editor/type";

export abstract class Script<T = void> extends Action<T> {
	archive: LogRec[] = [];

	protected abstract invoke(): Promise<T>;
	protected abstract revert(): Promise<void>;

	protected engine = {
		exec: async <R>(action: Action<R>): Promise<R> => {
			const result = await action.exec();
			this.log("execute", action);
			return result;
		},

		undo: async <R>(action: Action<R>): Promise<void> => {
			await action.undo();
			this.log("undo", action);
		},
	};

	private log(phase: string, action: Action<unknown>): void {
		const now = new Date();
		this.archive.push({
			kind: LogKind.Info,
			source: action.name,
			status: "success",
			message: `Success ${phase} ${action.name}`,
			payload: action.payload,
			time: now.toTimeString(),
			stamp: now.getTime(),
		});
	}

	async exec(): Promise<T> {
		try {
			return await this.invoke();
		}
		catch (error) {
			await this.revert();
			throw error;
		}
	}

	override async undo(): Promise<void> {
		await this.revert();
	}
}
