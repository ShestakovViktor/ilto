<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useEditorContext, useScopeContext} from "@src/editor/view/context";
import {SceneTree} from "@src/editor/view/component";
import {useCoreContext} from "@src/core/view/context";
import {ActivityKind} from "@src/editor/enum";

const {stats} = useCoreContext();
const {session} = useEditorContext();

function onSelect(id: number): void {
	if (session.activity.kind == ActivityKind.ImageCreate) {
		session.activity.payload.parentId = id;
	}
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