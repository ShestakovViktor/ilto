<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useViewerContext} from "@src/viewer/context";

const {canvas, overlay, scene, input} = useViewerContext();

const viewerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const overlayRef = ref<HTMLDivElement | null>(null);

const emit = defineEmits<{
	ready: [element: HTMLElement];
}>();

onMounted((): void => {
	const viewerEl = viewerRef.value;
	const canvasEl = canvasRef.value;
	const overlayEl = overlayRef.value;

	if (!viewerEl || !canvasEl || !overlayEl) return;

	input.setElement(viewerEl);

	canvas.setCanvas(canvasEl);
	overlay.setElement(overlayEl);
	scene.setSize(0, 0, 1920, 1080);

	// await canvas.initTest();

	canvas.draw();

	emit("ready", viewerEl);
});

</script>

<template>
<div
	ref="viewerRef"
	class="Viewer"
	:draggable="false"
>
	<canvas
		ref="canvasRef"
		class="Canvas"
	/>
	<div
		ref="overlayRef"
		class="Overlay"
	/>
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

	.Canvas {
		position: absolute;
		left: 0;
		top: 0;

		display: block;
		width: 100%;
		height: 100%;
	}

	.Overlay {
		position: absolute;
		left: 0;
		top: 0;
		background-color: rgba(173, 216, 230, 0.199);

		pointer-events: none;
	}
}
</style>
