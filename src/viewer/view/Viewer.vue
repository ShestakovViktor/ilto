<script setup lang="ts">
import {ref, onMounted, onUnmounted} from "vue";
import {useViewerContext} from "@src/viewer/context";

const {viewport, canvas, input} = useViewerContext();

const viewerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

let resizeObserver: ResizeObserver | null = null;

const emit = defineEmits<{
	ready: [element: HTMLElement];
}>();

onMounted(() => {
	const viewer = viewerRef.value;
	const canvasEl = canvasRef.value;

	if (!viewer || !canvasEl) return;

	canvas.setContext(canvasEl);
	const rect = canvasEl.getBoundingClientRect();

	viewport.setFrame({x: 0, y: 0, w: rect.width, h: rect.height});
	viewport.setCanvas({x: 0, y: 0, w: 10, h: 10});

	input.setElement(viewer);

	resizeObserver = new ResizeObserver((entries) => {
		const {width, height} = entries[0].contentRect;

		if (canvasEl.width !== width) {
			canvasEl.width = width;
		}
		if (canvasEl.height !== height) {
			canvasEl.height = height;
		}

		viewport.setFrame({x: 0, y: 0, w: width, h: height});
		canvas.draw();
	});

	resizeObserver.observe(viewer);

	canvas.draw();

	if (viewerRef.value) {
		emit("ready", viewerRef.value);
	}
});

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect();
	}
});
</script>

<template>
<div
	ref="viewerRef"
	class="Viewer"
	:draggable="false"
>
	<canvas ref="canvasRef" />
</div>
</template>

<style lang="scss" scoped>

.Viewer {
	overflow: hidden;
	position: relative;

	width: 100%;
	height: 100%;

	background-color: var(--gray-94);
	background-image:
		linear-gradient(var(--gray-80) 2px, transparent 2px),
		linear-gradient(90deg, var(--gray-80) 2px, transparent 2px),
		linear-gradient(var(--gray-80) 1px, transparent 1px),
		linear-gradient(90deg, var(--gray-80) 1px, var(--gray-94) 1px);
	background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
	background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;

	canvas {
		display: block;
	}

	.Canvas {
		--scale: 1;
		--x: 0;
		--y: 0;
		--w: 0;
		--h: 0;

		transform: translate(var(--x), var(--y));
		width: calc(var(--w) * var(--scale));
		height: calc(var(--h) * var(--scale));

		transform-origin: top left;
		position: absolute;

		background-color: var(--gray-90);
		background-image:
			repeating-linear-gradient(45deg, var(--gray-80) 25%, transparent 25%, transparent 75%, var(--gray-80) 75%, var(--gray-80)),
			repeating-linear-gradient(45deg, var(--gray-80) 25%, var(--gray-94) 25%, var(--gray-94) 75%, var(--gray-80) 75%, var(--gray-80));
		background-position: 0 0, 10px 10px;
		background-size: 20px 20px;

	}
}
</style>
