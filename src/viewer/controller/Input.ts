import type {Viewport, Loop} from "@src/viewer/controller";

type Gesture = {
	x: number;
	y: number;
	perimeter: number;
	moment: number;
	double: boolean;
};

export class Input {
	private mouse = {x: 0, y: 0};

	private gesture: Gesture = {
		x: 0,
		y: 0,
		perimeter: 0,
		moment: performance.now(),
		double: false,
	};

	private inertia = 5;

	constructor(
		private engine: Loop,
		private viewport: Viewport
	) {}

	setElement(el: HTMLElement): void {
		el.addEventListener("mousedown", (e) => this
			.handleMouseDown({x: e.clientX, y: e.clientY, b: e.buttons}));
		el.addEventListener("mousemove", (e) => this
			.handleMouseMove({x: e.clientX, y: e.clientY, b: e.buttons}));
		el.addEventListener("mouseup", () => this
			.handleMouseUp());
		el.addEventListener("mouseleave", () => this
			.handleMouseUp());
		el.addEventListener("wheel", (e) => this
			.handleMouseWheel({x: e.clientX, y: e.clientY, d: e.deltaY}));
	}

	private handleMouseDown(event: {x: number; y: number; b: number}): void {
		if (event.b != 1) return;
		this.mouse = {...event};
	}

	private handleMouseMove(event: {x: number; y: number; b: number}): void {
		if (event.b != 1) return;

		this.handleDrag(
			event.x - this.mouse.x,
			event.y - this.mouse.y,
			performance.now() - .5 * 200,
			200
		);

		this.mouse = event;
	}

	private handleMouseUp(): void {
		this.handleEnd(performance.now(), 400);
	}

	private handleMouseWheel(event: {x: number; y: number; d: number}): void {
		const oldDelta = this.viewport.s.dest / this.viewport.s.value;

		const newDelta = Math.pow(Math.exp(0.2), event.d > 0 ? -1 : 1);

		this.handleZoom(
			oldDelta,
			newDelta,
			event.x - this.viewport.frame.x,
			event.y - this.viewport.frame.y,
			performance.now(),
			200
		);
	}

	private handleTouchStart(event: TouchEvent): void {
		event.preventDefault();

		this.gesture = {
			...this.getCentroid(event),
			perimeter: this.getPerimeter(event),
			moment: performance.now(),
			double: event.touches.length == 1
                && event.timeStamp - this.gesture.moment < 300,
		};
	}

	private handleTouchMove(event: TouchEvent): void {
		event.preventDefault();

		const gesture: Gesture = {
			...this.getCentroid(event),
			perimeter: this.getPerimeter(event),
			moment: performance.now(),
			double: this.gesture.double,
		};

		if (gesture.perimeter != this.gesture.perimeter) {
			const oldDelta = this.viewport.s.dest / this.viewport.s.value;
			const foo = gesture.perimeter - this.gesture.perimeter;
			const newDelta = Math.pow(Math.exp(.02), Math.sign(foo));
			this.handleZoom(
				oldDelta,
				newDelta,
				gesture.x - this.viewport.frame.x,
				gesture.y - this.viewport.frame.y,
				performance.now() - 200,
				200
			);
		}
		else if (this.gesture.double) {
			const oldDelta = this.viewport.s.dest / this.viewport.s.value;
			const foo = gesture.y - this.gesture.y;
			const newDelta = Math.pow(
				Math.exp(Math.abs(foo) * 0.01),
				Math.sign(foo)
			);

			this.handleZoom(
				oldDelta,
				newDelta,
				gesture.x - this.viewport.frame.x,
				gesture.y - this.viewport.frame.y,
				performance.now() - .5 * 200,
				200
			);
		}
		else {
			this.handleDrag(
				gesture.x - this.gesture.x,
				gesture.y - this.gesture.y,
				performance.now() - .5 * 200,
				200
			);
		}

		this.gesture = gesture;
	}

	private handleTouchEnd(): void {
		this.handleEnd(performance.now(), 400);
	}

	private handleZoom(
		oldDelta: number,
		newDelta: number,
		x: number,
		y: number,
		time: number,
		span: number
	): void {
		this.viewport.x.set(
			this.viewport.x.dest + (x - this.viewport.x.value)
                * oldDelta * (1 - newDelta),
			time,
			span
		);

		this.viewport.y.set(
			this.viewport.y.dest + (y - this.viewport.y.value)
                * oldDelta * (1 - newDelta),
			time,
			span
		);

		this.viewport.s.set(
			this.viewport.s.dest * newDelta,
			time,
			span
		);

		this.engine.requestUpdate();
	}

	private handleDrag(x: number, y: number, time: number, span: number): void {
		this.viewport.x.set(this.viewport.x.dest + x, time, span);
		this.viewport.y.set(this.viewport.y.dest + y, time, span);
		this.engine.requestUpdate();
	}

	private handleEnd(time: number, span: number): void {
		this.viewport.x.set(
			this.viewport.x.init
				+ (this.viewport.x.dest - this.viewport.x.init)
				* this.inertia,
			time,
			span
		);

		this.viewport.constrain();

		this.viewport.y.set(
			this.viewport.y.init
				+ (this.viewport.y.dest - this.viewport.y.init)
				* this.inertia,
			time,
			span
		);

		this.viewport.constrain();
	}

	private getCentroid(event: TouchEvent): {x: number; y: number} {
		const centroid = {x: 0, y: 0};

		for (const touch of event.touches) {
			centroid.x += touch.clientX;
			centroid.y += touch.clientY;
		}

		centroid.x = centroid.x / event.touches.length;
		centroid.y = centroid.y / event.touches.length;

		return centroid;
	}

	private getPerimeter(event: TouchEvent): number {
		let result = 0;
		let prev = event.touches[event.touches.length - 1];
		for (const point of event.touches) {
			result += Math.hypot(
				point.clientX - prev.clientX,
				point.clientY - prev.clientY
			);
			prev = point;
		}

		return result;
	}
}