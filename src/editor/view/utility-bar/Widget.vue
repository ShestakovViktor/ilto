<script setup lang="ts">
import {ref} from "vue";
import {useScopeContext} from "@src/editor/context";

type Config = {
	collapsed: boolean;
	height: number;
};

const props = defineProps<{
	title: string;
	class?: string;
}>();

const scope = useScopeContext<Config>();
if (!scope.data.height) scope.data.height = 150;
if (!scope.data.collapsed) scope.data.collapsed = false;

function toggleCollapsed(): void {
	scope.data.collapsed = !scope.data.collapsed;
}

const contentRef = ref<HTMLDivElement>();

function startResize(event: MouseEvent): void {
	const y = event.y;
	const h = scope.data.height
		|| contentRef.value!.getBoundingClientRect().height;

	function handleResize(event: MouseEvent): void {
		if (event.button === 0) {
			scope.data.height = h + (event.y - y);
		}
	}

	function stopResize(): void {
		window.removeEventListener("mousemove", handleResize);
		window.removeEventListener("mouseup", stopResize);
	}

	window.addEventListener("mousemove", handleResize);
	window.addEventListener("mouseup", stopResize);

	event.preventDefault();
}
</script>

<template>
<div
	class="Widget"
	:class="{'Collapsed': scope.data.collapsed}"
>
	<div
		class="Header"
		@click="toggleCollapsed"
	>
		<div class="Title">
			{{ props.title }}
		</div>
		<div class="Collapsed">
			{{ scope.data.collapsed ? "+" : "-" }}
		</div>
	</div>
	<div
		ref="contentRef"
		class="Content"
		:class="props.class"
		:style="{height: scope.data.height + 'px'}"
	>
		<slot />
	</div>
	<div
		class="Edge"
		@mousedown="startResize"
	/>
</div>
</template>

<style lang="scss" scoped>
.Widget {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;

    display: flex;
    flex-direction: column;

    &:not(:last-child) {
        margin-bottom: 8px;
    }

    >.Header {
        padding: 8px;
        background-color: var(--gray-98);
        display: flex;
        justify-content: space-between;

        >.Title {
            font-weight: bold;
        }
    }

    .Content {
        padding: 8px;
        overflow: scroll;
        flex-grow: 1;
    }

    &.Collapsed {

        .Content,
        .Edge {
            display: none;
        }
    }

    .Edge {
        width: 100%;
        height: 6px;
        background: red;
        cursor: ns-resize;
        background-color: var(--gray-98);
    }
}
</style>