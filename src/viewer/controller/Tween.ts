export type EasingType = "linear" | "out" | "outBack";
export type EaseFunction = (init: number, dest: number, time: number) => number;

export class Tween {
	static linear(init: number, dest: number, time: number): number {
		return (1 - time) * init + time * dest;
	}

	static out(init: number, dest: number, time: number): number {
		return init + (dest - init) * (1 - Math.pow(1 - time, 3));
	}

	static outBack(start: number, end: number, time: number): number {
		const s = 1.70158;

		const progress = 1 + (s + 1) * Math.pow(time - 1, 3)
            + s * Math.pow(time - 1, 2);

		return start + (end - start) * progress;
	}

	private static readonly easeMap: Record<EasingType, EaseFunction> = {
		linear: Tween.linear,
		out: Tween.out,
		outBack: Tween.outBack,
	};

	value: number;

	init: number;

	dest: number;

	time = 0;

	span = 0;

	ease: EaseFunction;

	constructor(value: number, ease: EasingType = "linear") {
		this.value = value;
		this.init = value;
		this.dest = value;
		this.ease = Tween.easeMap[ease];
	}

	set(
		dest: number,
		time: number,
		span: number,
		ease: EasingType = "linear"
	): void {
		this.init = this.value;
		this.dest = dest;
		this.time = time;
		this.span = span;
		this.ease = Tween.easeMap[ease];
	}

	private getDelta(current: number, start: number, duration: number): number {
		const t = (current - start) / duration;
		return t < 0 ? 0 : t > 1 ? 1 : t;
	}

	update(now: number): number {
		const delta = this.getDelta(now, this.time, this.span);
		this.value = this.ease(this.init, this.dest, delta);

		if (delta === 1) {
			this.init = this.value;
		}

		return delta;
	}
}