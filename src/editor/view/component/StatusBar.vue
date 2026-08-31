<script setup lang="ts">
import {useEditorContext} from "@src/editor/view/context";
import {useViewerContext} from "@src/viewer/view/context";

const {session} = useEditorContext();
const {viewer} = useViewerContext();

</script>

<template>
<div class="StatusBar">
	<div>mode: {{ session.inputKind }}</div>
	<!-- <div>scale: {{ viewer.scale }}</div> -->
	<span />
	<div>selected: {{ session.selected?.id || "" }}</div>
	<div>layer: {{ session.layer?.id || "" }}</div>
</div>
</template>

<style lang="scss" scoped>
.StatusBar {
    width: 100%;
    height: 24px;

    display: grid;
    grid-template-columns: min-content min-content auto min-content min-content;
    grid-template-rows: auto;
    column-gap: 16px;

    padding: 0px 6px;

    >div {
        white-space: nowrap;
    }
}
</style>