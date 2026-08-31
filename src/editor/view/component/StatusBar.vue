<script setup lang="ts">
import {useEditorContext} from "@src/editor/view/context";

const {session} = useEditorContext();

</script>

<template>
<div class="StatusBar">
	<div>target: {{ session.activity.target }}</div>
	<div>action: {{ session.activity.action }}</div>
	<!-- <div>scale: {{ viewer.scale }}</div> -->
	<span />
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