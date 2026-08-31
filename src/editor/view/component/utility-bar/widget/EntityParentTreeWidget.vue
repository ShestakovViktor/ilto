<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useEditorContext, useScopeContext} from "@src/editor/view/context";
import {SceneTree} from "@src/editor/view/component";
import {useStorageContext} from "@src/storage/view/context";
import {useViewerContext} from "@src/viewer/shared/view/context";
import {DraftParentChangeScript} from "@src/editor/script";

const {stats} = useStorageContext();
const viewer = useViewerContext();
const {session, engine} = useEditorContext();

async function onSelect(id: number): Promise<void> {
	await engine.exec(new DraftParentChangeScript(viewer, session, {id}));
}

useScopeContext("EntityParentTreeWidget");
</script>

<template>
<Widget title="Entity parent tree">
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