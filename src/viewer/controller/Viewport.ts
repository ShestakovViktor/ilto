type Tween = {
    curr: number;
    init: number;
    dest: number;
    time: number;
    span: number;
    ease: (start: number, end: number, time: number) => number;
};

type Gesture = {
    x: number;
    y: number;
    perimeter: number;
    moment: number;
    double: boolean;
};

export class Viewport {
    private frame = {x: 0, y: 0, w: 0, h: 0};

    private canvas = {x: 0, y: 0, w: 0, h: 0};

    x: Tween = {
        init: 0,
        curr: 0,
        dest: 0,
        time: 0,
        span: 0,
        ease: this.linearEasing,
    };

    y: Tween = {
        init: 0,
        curr: 0,
        dest: 0,
        time: 0,
        span: 0,
        ease: this.linearEasing,
    };

    s: Tween = {
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

    private onUpdate: () => void = () => {};

    setFrame(rect: {x: number; y: number; w: number; h: number}) {
        this.frame = rect;
    }

    setCanvas(rect: {x: number; y: number; w: number; h: number}) {
        this.canvas = rect;
    }

    setUpdate(onUpdate: () => void) {
        this.onUpdate = onUpdate;
    }

    handleMouseDown(event: {x: number; y: number; b: number}): void {
        if (event.b != 1) return;
        this.mouse = {...event};
    }

    handleMouseMove(event: {x: number; y: number; b: number}): void {
        if (event.b != 1) return;

        this.handleDrag(
            event.x - this.mouse.x,
            event.y - this.mouse.y,
            performance.now() - .5 * 200,
            200
        );

        this.mouse = event;
    }

    handleMouseUp(): void {
        this.handleEnd(performance.now(), 400);
    }

    handleMouseWheel(event: {x: number; y: number; d: number}): void {
        if (!this.frame || !this.canvas) return;

        const oldDelta = this.s.dest / this.s.curr;

        const newDelta = Math.pow(Math.exp(0.2), event.d > 0 ? -1 : 1);

        this.handleZoom(
            oldDelta,
            newDelta,
            event.x - this.frame.x,
            event.y - this.frame.y,
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
        const deltaX = this.handle(this.x);
        const deltaY = this.handle(this.y);
        const deltaS = this.handle(this.s);

        this.onUpdate();

        this.updateId = deltaX != 1 || deltaY != 1 || deltaS != 1
            ? requestAnimationFrame(() => this.update()) : undefined;
    }
}

