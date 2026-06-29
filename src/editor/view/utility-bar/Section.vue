<script setup lang="ts">
import {useScopeContext} from "@src/editor/context";

const props = defineProps<{
	title: string;
	className?: string;
}>();

const scope = useScopeContext<{collapsed: boolean}>();
if (!scope.data.collapsed) scope.data.collapsed = false;

function toggleCollapsed(): void {
	scope.data.collapsed = !scope.data.collapsed;
}
</script>

<template>
<div
	class="Section"
	:class="{'Expand': scope.data.collapsed}"
>
	<div
		class="Header"
		@click="toggleCollapsed"
	>
		<div class="Title">
			{{ props.title }}
		</div>
		<div class="Expand">
			{{ scope.data.collapsed ? "-" : "+" }}
		</div>
	</div>
	<div :class="['Content', props.className]">
		<slot />
	</div>
</div>
</template>

<style lang="scss" scoped>
.Section {
    >.Header {
        display: flex;
        justify-content: space-between;

        >.Title {
            font-weight: bold;
        }
    }

    >.Content {
        padding: 8px;
        display: none;
    }

    &.Expand>.Content {
        display: block;
    }
}
</style>