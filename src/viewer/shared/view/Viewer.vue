<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useViewerContext} from "@src/viewer/shared/view/context";

const {canvas, scene, input} = useViewerContext();

const viewerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const emit = defineEmits<{
	ready: [element: HTMLElement];
}>();

onMounted((): void => {
	const viewerEl = viewerRef.value;
	const canvasEl = canvasRef.value;

	if (!viewerEl || !canvasEl) return;

	input.setElement(viewerEl);

	canvas.setCanvas(canvasEl);
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
}
</style>
