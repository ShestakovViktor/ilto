<script setup lang="ts">
import LayerIconSvg from "@src/svg/small/layer.svg?raw";
import MarkerIconSvg from "@src/svg/small/marker.svg?raw";
import TrashIconSvg from "@src/svg/small/trash.svg?raw";
import TileIconSvg from "@src/svg/small/tile.svg?raw";
import FootnoteIconSvg from "@src/svg/small/footnote.svg?raw";

import TreeLeafItemIconSvg from "@src/svg/small/tree-leaf-item.svg?raw";
import TreeLeafOpenIconSvg from "@src/svg/small/tree-leaf-open.svg?raw";
import TreeLeafCloseIconSvg from "@src/svg/small/tree-leaf-close.svg?raw";

import type {Entity, Parent} from "@src/core/type";
import {Button, Icon} from "@src/core/view";
import {EntityKind} from "@src/core/enum";
import {useEditorContext} from "@src/editor/context";
import {computed, ref} from "vue";

const props = defineProps<{
	entityId: number;
	onClick?: (selected: unknown) => void;
}>();

const {storage, session, setSession} = useEditorContext();

const isExpanded = ref(false);

const entityMemo = computed(() => {
	const entity = storage.entity.select(props.entityId);
	if (!entity) throw new Error();
	return entity;
});

const isSelected = computed(() => {
	return session.selected?.id == props.entityId;
});

function expand(): void {
	isExpanded.value = !isExpanded.value;
}

function isParent(entity: Entity): entity is Entity & Parent {
	return "childIds" in entity;
}

function onSelect(): void {
	setSession({
		selected: entityMemo.value,
	});
}

const childrenMemo = computed(() => {
	// const entity = entityMemo.value;
	return undefined;
	// return isParent(entity)
	// 	? entity.childIds.map((id) => <EntityNode entityId={id}/>)
	// 	: undefined;
});

const icons: Record<string, {label: string; icon: string}> = {
	[EntityKind.Layer]: {
		label: "layer",
		icon: LayerIconSvg,
	},
	[EntityKind.Tile]: {
		label: "tile",
		icon: TileIconSvg,
	},
	[EntityKind.Marker]: {
		label: "marker",
		icon: MarkerIconSvg,
	},
	[EntityKind.Footnote]: {
		label: "footnote",
		icon: FootnoteIconSvg,
	},
};

const boop = icons[entityMemo.value.kind]
	|| {
		label: "undefined",
		icon: TrashIconSvg,
	};

const leafIconMemo = computed(() =>
	!childrenMemo.value
		? TreeLeafItemIconSvg
		: isExpanded.value
			? TreeLeafOpenIconSvg
			: TreeLeafCloseIconSvg
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
		@click="onSelect"
	>
		<Button
			class="Icon"
			:icon="leafIconMemo"
			@click="expand"
		/>
		<Icon
			class="Icon"
			:svg="boop.icon"
		/>
		{{ boop.label }} (id {{ entityMemo.id }})
	</div>
	<div class="Body">
		{{ childrenMemo }}
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
		color: red;
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
