<script setup lang="ts">
import {
	ModalLayer,
	ActivityBar,
	StatusBar,
	WorkSpace,
	Scope,
} from "@src/editor/view";
import {UtilityBar} from "@src/editor/view/utility-bar";
import {Viewer} from "@src/viewer/view";
import {useEditorContext} from "@src/editor/context";

const {mouse} = useEditorContext();

function onViewerReady(element: HTMLElement): void {
	mouse.setElement(element);
}

</script>

<template>
<Scope name="Editor">
	<div
		class="Editor"
		:tabindex="0"
	>
		<ActivityBar />
		<UtilityBar />
		<WorkSpace>
			<Viewer @ready="onViewerReady" />
		</WorkSpace>
		<StatusBar />
		<ModalLayer />
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
		grid-area: workspace;
		min-width: 0;
	}

	> :nth-child(4) {
		grid-area: status;
	}

	> :nth-child(5) {
		grid-area: workspace;
		position: absolute;
	}
}
</style>