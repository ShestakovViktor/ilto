import {InputMode} from "./InputMode";

export abstract class InputResolveMode<T> extends InputMode {
	protected resolve: (data: T) => Promise<void>;

	constructor(
		resolve: (data: T) => void | Promise<void>
	) {
		super();

		this.resolve = async (data: T) => {
			await resolve(data);

			if (this.release) {
				this.release();
			}
		};

	}

	protected release?: () => void;

	onRelease(callback: () => void): void {
		this.release = callback;
	}
}