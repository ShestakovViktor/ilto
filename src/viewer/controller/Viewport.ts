import {SetStoreFunction} from "solid-js/store";

type Tween = {
    curr: number;
    init: number;
    dest: number;
    time: number;
    span: number;
    ease: (start: number, end: number, time: number) => number;
};

type Element = {
    x: number;
    y: number;
    w: number;
    h: number;
    e: HTMLElement | undefined;
};

type Gesture = {
    x: number;
    y: number;
    perimeter: number;
    moment: number;
    double: boolean;
};

export class Viewport {
    private frame: Element = {x: 0, y: 0, w: 0, h: 0, e: undefined};

    private canvas: Element = {x: 0, y: 0, w: 0, h: 0, e: undefined};

    private x: Tween = {
        init: 0,
        curr: 0,
        dest: 0,
        time: 0,
        span: 0,
        ease: this.linearEasing,
    };

    private y: Tween = {
        init: 0,
        curr: 0,
        dest: 0,
        time: 0,
        span: 0,
        ease: this.linearEasing,
    };

    private s: Tween = {
        init: 1,
        curr: 1,
        dest: 1,
        time: 0,
        span: 0,
        ease: this.linearEasing,
    };

    private mouse = {x: 0, y: 0};

    private gesture: Gesture = {
        x: 0,
        y: 0,
        perimeter: 0,
        moment: performance.now(),
        double: false,
    };

    private updateId?: number;

    private inertia = 5;

    constructor(private setState: SetStoreFunction<{
        x: number;
        y: number;
        scale: number;
    }>) {}

    setFrame(element: HTMLElement) {
        if (element != this.frame.e) {
            element.addEventListener("mousedown", (e) => this.handleMouseDown(e));
            element.addEventListener("mousemove", (e) => this.handleMouseMove(e));
            element.addEventListener("mouseup", () => this.handleMouseUp());
            element.addEventListener("mouseleave", () => this.handleMouseUp());
            element.addEventListener("wheel", (e) => this.handleMouseWheel(e));

            element.addEventListener("touchstart", (e) => this.handleTouchStart(e));
            element.addEventListener("touchmove", (e) => this.handleTouchMove(e));
            element.addEventListener("touchend", () => this.handleTouchEnd());
        }

        const r = element.getBoundingClientRect();
        this.frame = {x: r.x, y: r.y, w: r.width, h: r.height, e: element};

    }

    setCanvas(element: HTMLElement) {
        const r = element.getBoundingClientRect();
        this.canvas = {x: 0, y: 0, w: r.width, h: r.height, e: element};
    }

    private handleMouseDown(event: MouseEvent): void {
        if (event.buttons != 1) return;

        this.mouse = {x: event.clientX, y: event.clientY};

    }

    private handleMouseMove(event: MouseEvent): void {
        if (event.buttons != 1) return;

        const mouse = {x: event.clientX, y: event.clientY};

        this.handleDrag(
            mouse.x - this.mouse.x,
            mouse.y - this.mouse.y,
            performance.now() - .5 * 200,
            200
        );

        this.mouse = mouse;
    }

    private handleMouseUp(): void {
        this.handleEnd(performance.now(), 400);
    }

    private handleMouseWheel(event: WheelEvent): void {
        event.preventDefault();
        if (!this.frame || !this.canvas) return;

        const oldDelta = this.s.dest / this.s.curr;

        const newDelta = Math.pow(Math.exp(0.2), event.deltaY > 0 ? -1 : 1);

        this.handleZoom(
            oldDelta,
            newDelta,
            event.clientX - this.frame.x,
            event.clientY - this.frame.y,
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
            const oldDelta = this.s.dest / this.s.curr;
            const foo = gesture.perimeter - this.gesture.perimeter;
            const newDelta = Math.pow(Math.exp(.02), Math.sign(foo));
            this.handleZoom(
                oldDelta,
                newDelta,
                gesture.x - this.frame.x,
                gesture.y - this.frame.y,
                performance.now() - 200,
                200
            );
        }
        else if (this.gesture.double) {
            const oldDelta = this.s.dest / this.s.curr;
            const foo = gesture.y - this.gesture.y;
            const newDelta = Math.pow(
                Math.exp(Math.abs(foo) * 0.01),
                Math.sign(foo)
            );

            this.handleZoom(
                oldDelta,
                newDelta,
                gesture.x - this.frame.x,
                gesture.y - this.frame.y,
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
    ) {
        this.x = {
            curr: this.x.curr,
            init: this.x.curr,
            dest: this.x.dest + (x - this.x.curr)
                * oldDelta * (1 - newDelta),
            ease: this.linearEasing,
            time,
            span,
        };

        this.y = {
            curr: this.y.curr,
            init: this.y.curr,
            dest: this.y.dest + (y - this.y.curr)
                * oldDelta * (1 - newDelta),
            ease: this.linearEasing,
            time,
            span,
        };

        this.s = {
            curr: this.s.curr,
            init: this.s.curr,
            dest: this.s.dest * newDelta,
            ease: this.linearEasing,
            time,
            span,
        };

        if (!this.updateId) this.update();
    }

    private handleDrag(
        x: number,
        y: number,
        time: number,
        span: number

    ) {
        this.x = {
            curr: this.x.curr,
            init: this.x.curr,
            dest: this.x.dest + x,
            ease: this.linearEasing,
            time,
            span,
        };

        this.y = {
            curr: this.y.curr,
            init: this.y.curr,
            dest: this.y.dest + y,
            ease: this.linearEasing,
            time,
            span,
        };

        if (!this.updateId) this.update();
    }

    private handleEnd(time: number, span: number) {
        this.x = {
            curr: this.x.curr,
            init: this.x.init,
            dest: this.x.init + (this.x.dest - this.x.init) * this.inertia,
            ease: this.outEasing,
            time,
            span,
        };

        this.handleBounds(this.x, this.frame.w, this.canvas.w * this.s.curr);

        this.y = {
            curr: this.y.curr,
            init: this.y.init,
            dest: this.y.init + (this.y.dest - this.y.init) * this.inertia,
            ease: this.outEasing,
            time,
            span,
        };

        this.handleBounds(this.y, this.frame.h, this.canvas.h * this.s.curr);

        if (!this.updateId) this.update();
    }

    private handleBounds(tween: Tween, frame: number, canvas: number): void {
        const delta = frame - canvas;
        const bounds = {min: Math.min(delta, 0), max: Math.max(delta, 0)};

        if (tween.dest < bounds.min || tween.dest > bounds.max) {
            tween.dest = tween.dest < bounds.min ? bounds.min : bounds.max;
            tween.ease = this.outBackEasing;
        }
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

    private linearEasing(init: number, dest: number, time: number): number {
        return (1 - time) * init + time * dest;
    }

    private outEasing(init: number, dest: number, time: number): number {
        return init + (dest - init) * (1 - Math.pow(1 - time, 3));
    }

    private outBackEasing(start: number, end: number, time: number): number {
        const s = 1.70158;

        const progress = 1 + (s + 1) * Math.pow(time - 1, 3)
            + s * Math.pow(time - 1, 2);

        return start + (end - start) * progress;
    }

    private getDelta(current: number, start: number, duration: number): number {
        const t = (current - start) / duration;
        return t < 0 ? 0 : t > 1 ? 1 : t;
    }

    private handle(prop: Tween): number {
        const now = performance.now();
        const delta = this.getDelta(now, prop.time, prop.span);
        prop.curr = prop.ease(prop.init, prop.dest, delta);
        if (delta == 1) prop.init = prop.curr;
        return delta;
    }

    private update(): void {
        const x = this.handle(this.x);
        const y = this.handle(this.y);
        const s = this.handle(this.s);

        this.setState({
            x: this.x.curr,
            y: this.y.curr,
            scale: this.s.curr,
        });

        this.updateId = x != 1 || y != 1 || s != 1
            ? requestAnimationFrame(() => this.update()) : undefined;
    }
}

