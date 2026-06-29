<script setup lang="ts">
import {Widget} from "@src/editor/view/utility-bar";
import {EntityKind} from "@src/core/enum";
import {useScopeContext, useEditorContext} from "@src/editor/context";
import type {Layer} from "@src/core/type";
import {computed} from "vue";

const {storage, session} = useEditorContext();

const layers = computed(() =>
	storage.entity
		.filter<Layer>({kind: EntityKind.Layer})
);

useScopeContext("LayerUtility");
</script>

<template>
<Widget title="Layers">
	<div class="Layers">
		<div
			v-for="(layer, index) in layers"
			:key="index"
			class="Layer"
			:class="{'Selected': session.layer == layer}"
			@click="() => session.layer = layer"
		>
			Layer id:{{ layer.id }}
			{{ String(session.layer == layer) }}
		</div>
	</div>
</Widget>
</template>

<style lang="scss" scoped>
.Layers {
	overflow-y: scroll;
	overflow-x: scroll;

	.Layer {
		cursor: pointer;
		color: red;
	}

	.Selected {
		color: blue;
	}
}
</style>