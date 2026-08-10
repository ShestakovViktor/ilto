<script setup lang="ts">
import {Widget} from "@src/editor/view/component/utility-bar";
import {useScopeContext} from "@src/editor/view/context";
// import {EntityNode} from "./view";

useScopeContext("ExploreUtility");
</script>

<template>
<Widget title="Explore">
	<div class="Explorer">
		<!-- <EntityNode entityId={1}/> -->
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