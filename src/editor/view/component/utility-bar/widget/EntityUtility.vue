<script setup lang="ts">

import {useScopeContext, useEditorContext} from "@src/editor/view/context";
import {type Entity, isSize, isSpatial, type Size, type Spatial} from "@src/core/type";
import {Widget, Section} from "..";
import {computed} from "vue";
import {Scope, Field} from "@src/editor/view/component";

const {storage, session} = useEditorContext();

const entity = computed(() => session.value.selected || {} as Entity);

const spatial = computed(() => {
	return isSpatial(entity.value)
		? entity as unknown as Entity & Spatial
		: undefined;
});

const size = computed(() => {
	return isSize(entity.value) ? entity : undefined;
});

function handleXChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	storage.entity.update<Entity & Spatial>(
		entity.value.id,
		{x: Number(target.value)}
	);
}

function handleYChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	storage.entity.update<Entity & Spatial>(
		entity.value.id,
		{y: Number(target.value)}
	);
}

function handleWidthChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	storage.entity.update<Entity & Size>(
		entity.value.id,
		{width: Number(target.value)}
	);
}

function handleHeightChange(event: Event): void {
	const target = event.target as HTMLInputElement;
	storage.entity.update<Entity & Size>(
		entity.value.id,
		{height: Number(target.value)}
	);
}

const labels = {
	id: "id",
	kind: "kind",
	x: "x",
	y: "y",
	width: "width",
	height: "height",
};

useScopeContext("EntityUtility");

</script>

<template>
<Scope name="EntityUtility">
	<Widget title="Entity">
		<Scope name="SystemSection">
			<Section title="system">
				<Field
					name="id"
					:label="labels.id"
					:value="String(entity?.id)"
					readonly
				/>
				<Field
					name="kind"
					:label="labels.kind"
					:value="String(entity.kind)"
					readonly
				/>
			</Section>
		</Scope>

		<Scope
			v-if="spatial"
			name="PositionSection"
		>
			<Section title="size">
				<Field
					name="x"
					type="number"
					:label="labels.x"
					:value="String(spatial?.x)"
					@change="handleXChange"
				/>
				<Field
					label="{labels.y}"
					type="number"
					name="y"
					value="{String(spatialMemo()?.y)}"
					on-change="{handleYChange}"
				/>
			</Section>
		</Scope>
		<Scope
			v-if="size"
			name="SizeSection"
		>
			<Section title="size">
				<Field
					label="{labels.width}"
					type="number"
					name="width"
					value="{String(sizeMemo()?.w)}"
					on-change="{handleWidthChange}"
				/>
				<Field
					label="{labels.height}"
					type="number"
					name="height"
					value="{String(sizeMemo()?.h)}"
					on-change="{handleHeightChange}"
				/>
			</Section>
		</Scope>
	</Widget>
</Scope>
</template>