<script setup lang="ts">
import {
	ActivityBar,
	StatusBar,
	WorkSpace,
	ModalLayer,
	Scope,
} from "@src/editor/view/component";
import {UtilityBar} from "@src/editor/view/component/utility-bar";
import {Viewer} from "@src/viewer/shared/view";
import {useEditorContext} from "@src/editor/view/context";
import {onMounted, ref} from "vue";

const {mouse, hotkey} = useEditorContext();

function onEditorReady(element: HTMLDivElement): void {
	hotkey.setElement(element);
}

function onViewerReady(element: HTMLElement): void {
	mouse.setElement(element);
}

const editorRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
	onEditorReady(editorRef.value!);
});

</script>

<template>
<Scope name="Editor">
	<div
		ref="editorRef"
		class="Editor"
		:tabindex="0"
	>
		<ActivityBar />
		<UtilityBar />
		<StatusBar />
		<WorkSpace>
			<Viewer @ready="onViewerReady" />
			<ModalLayer />
		</WorkSpace>
	<!-- <Notification /> -->
	</div>
</Scope>
</template>

<style scoped lang="scss">
.Editor {
	width: 100%;
	height: 100%;

	position: relative;

	display: grid;
	grid-template-columns: 60px 320px 1fr;
	grid-template-rows: 1fr 24px;
	grid-template-areas:
		"tool   utility workspace"
		"status status  status   ";

	> :nth-child(1) {
		grid-area: tool;
	}

	> :nth-child(2) {
		grid-area: utility;
	}

	> :nth-child(3) {
		grid-area: status;
		min-width: 0;
	}

	> :nth-child(4) {
		grid-area: workspace;
	}
}
</style>