<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useEditorContext, useScopeContext} from "@src/editor/view/context";
import {SceneTree} from "@src/editor/view/component";
import {useStorageContext} from "@src/storage/view/context";
import {DraftParentSetAction} from "@src/editor/action/draft";
import {useViewerContext} from "@src/viewer/shared/view/context";
import {AdornerUpdateAction} from "@src/viewer/adorner";

const {stats} = useStorageContext();
const {scene, adorner} = useViewerContext();
const {session, engine} = useEditorContext();

async function onSelect(id: number): Promise<void> {
	await engine.apply(new DraftParentSetAction(scene, session, {id}));
}

useScopeContext("ExploreUtility");
</script>

<template>
<Widget title="Explore">
	<div class="Explorer">
		<SceneTree
			:key="stats.revision"
			:is-root="true"
			:on-select="onSelect"
		/>
	</div>
</Widget>
</template>

<style lang="scss">
.Explorer {
	overflow-y: scroll;
	overflow-x: scroll;
	pointer-events: none;
}
</style>