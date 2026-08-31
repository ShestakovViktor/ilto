import {Action} from "@src/shared/controller";
import {LogKind} from "@src/editor/enum";
import type {LogRec} from "@src/editor/type";

export type Apply = <R>(action: Action<R>) => Promise<R>;
export type Revert = <R>(action: Action<R>) => Promise<void>;

export abstract class Script<T = void> extends Action<T> {
	log: LogRec[] = [];

	private safeApply: Apply;
	private safeRevert: Revert;

	protected abstract applying(
		apply: Apply,
		revert: Revert
	): Promise<T>;
	protected abstract reverting(
		apply: Apply,
		revert: Revert
	): Promise<void>;

	constructor() {
		super();

		this.safeApply = async (action) => {
			const result = await action.apply();
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

		this.safeRevert = async (action) => {
			await action.revert();
			const now = new Date();

			this.log.push({
				kind: LogKind.Info,
				source: action.name,
				status: "success",
				message: `Success undo ${action.name}`,
				payload: action.payload,
				time: now.toTimeString(),
				stamp: now.getTime(),
			});
		};
	}

	async apply(): Promise<T> {
		try {
			return await this.applying(this.safeApply, this.safeRevert);
		}
		catch (error) {
			await this.revert();
			throw error;
		}
	}

	override async revert(): Promise<void> {
		await this.reverting(this.safeApply, this.safeRevert);
	}
}
