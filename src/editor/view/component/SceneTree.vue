<script setup lang="ts">

import {isParent} from "@src/core/type/property";
import {Button} from "@src/editor/view/component";
import {EntityKind, IconName} from "@src/core/enum";
import {useTreeContext} from "@src/editor/view/context";
import {computed, ref} from "vue";
import {useCoreContext} from "@src/core/view/context";

type Props = {
	entityId?: number;
	isRoot?: boolean;
	onSelect?: (selected: number) => void;
};

const props = withDefaults(defineProps<Props>(), {
	entityId: 1,
	isRoot: false,
	onSelect: (selected: number) => {console.log(selected);},
});

const {selectedId} = useTreeContext(2, props.isRoot);
const {storage} = useCoreContext();

const isExpanded = ref(false);

const entity = computed(() => {
	const entity = storage.entity.select(props.entityId);
	if (!entity) throw new Error();
	return entity;
});

const isSelected = computed(() => {
	return selectedId.value === props.entityId;
});

function selectHandle(): void {
	selectedId.value = entity.value.id;
	props.onSelect(entity.value.id);
}

function expand(): void {
	isExpanded.value = !isExpanded.value;
}

const childIds = computed(() => {
	return isParent(entity.value) ? entity.value.childIds : undefined;
});

const treeItems: Record<string, {label: string; icon: string}> = {
	[EntityKind.Group]: {
		label: "group",
		icon: IconName.TreeItem,
	},
	[EntityKind.Image]: {
		label: "image",
		icon: IconName.TreeItem,
	},
};

const item = treeItems[entity.value.kind];

const icon = computed(() =>
	!childIds.value
		? IconName.TreeItem
		: isExpanded.value
			? IconName.TreeClose
			: IconName.TreeOpen
);
</script>

<template>
<div
	class="Node"
	:class="{
		'Selected': isSelected,
		'Expanded': isExpanded,
	}"
>
	<div
		class="Head"
		:title="`id ${entity.id}`"
		@click="selectHandle"
	>
		<Button
			:icon="icon"
			size="small"
			@click="expand()"
		/>
		{{ entity.name || item.label }}
	</div>
	<div
		v-if="childIds && childIds.length > 0"
		class="Body"
	>
		<SceneTree
			v-for="(id, index) in childIds"
			:key="index"
			:entity-id="id"
			:on-select="props.onSelect"
		/>
	</div>
</div>
</template>

<style lang="scss">
.Node {
	pointer-events: none;
	display: inline;

	.Head {
		width: fit-content;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		white-space: pre;
		gap: 8px;
		align-items: center;
		cursor: pointer;

		margin-top: 4px;

		padding: 2px;
		pointer-events: auto;

		.Icon {
			width: 16px;
			height: 16px;
		}
	}

	&.Selected>.Head {
		color: var(--red-30);
	}

	&.Expanded>.Body {
		display: flex;
	}

	.Body {
		display: none;
		flex-direction: column;
		width: fit-content;
		padding-left: 24px;
	}

}
</style>
