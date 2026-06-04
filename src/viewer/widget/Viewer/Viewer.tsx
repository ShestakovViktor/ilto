import * as styles from "./Viewer.module.scss";
import {JSX, onMount, onCleanup} from "solid-js";
import {useViewerContext} from "@src/viewer/context";

export function Viewer(): JSX.Element {
    const {viewport, canvas} = useViewerContext();

    let viewerRef!: HTMLDivElement;
    let canvasRef!: HTMLCanvasElement;

    // const width = createMemo(on(storage.reloaded, () => {
    //     const [widthOption] = storage.data.config
    //         .filter<Parameter>({name: ConfigOption.Width});
    //     if (!widthOption) throw new Error();

    //     return widthOption.number;
    // }));

    // const height = createMemo(on(storage.reloaded, () => {
    //     const [heightOption] = storage.data.config
    //         .filter<Parameter>({name: ConfigOption.Height});

    //     if (!heightOption) throw new Error();

    //     return heightOption.number;
    // }));

    onMount(() => {
        canvas.setContext(canvasRef);
        const rect = canvasRef.getBoundingClientRect();

        viewport.setFrame({x: 0, y: 0, w: rect.width, h: rect.height});
        viewport.setCanvas({x: 0, y: 0, w: 1920, h: 1080});

        viewerRef.addEventListener("mousedown", (e) => viewport.handleMouseDown({x: e.clientX, y: e.clientY, b: e.buttons}));
        viewerRef.addEventListener("mousemove", (e) => viewport.handleMouseMove({x: e.clientX, y: e.clientY, b: e.buttons}));
        viewerRef.addEventListener("mouseup", () => viewport.handleMouseUp());
        viewerRef.addEventListener("mouseleave", () => viewport.handleMouseUp());
        viewerRef.addEventListener("wheel", (e) => viewport.handleMouseWheel({x: e.clientX, y: e.clientY, d: e.deltaY}));

        // window.addEventListener("touchstart", (e) => this.handleTouchStart(e));
        // window.addEventListener("touchmove", (e) => this.handleTouchMove(e));
        // window.addEventListener("touchend", () => this.handleTouchEnd());

        const resizeObserver = new ResizeObserver((entries) => {
            const {width, height} = entries[0].contentRect;
            if (canvasRef.width != width) {
                canvasRef.width = width;
            }
            if (canvasRef.height != height) {
                canvasRef.height = height;
            }

            viewport.setFrame({x: 0, y: 0, w: width, h: height});

            canvas.draw();
        });

        resizeObserver.observe(viewerRef);

        onCleanup(() => {
            resizeObserver.disconnect();
        });

        canvas.draw();

    });

    return (
        <div class={styles.Viewer} ref={viewerRef} draggable={false}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}