<script setup lang="ts">
import {useEditorContext} from "@src/editor/context";
import type {Component} from "vue";
import {ModalKind} from "@src/editor/enum";
import {AssetBrowser} from "@src/editor/view";

const {session} = useEditorContext();

const views: Record<ModalKind, Component> = {
	[ModalKind.AssetBrowser]: AssetBrowser,
};

function closeModal(index: number): void {
	session.value.modal.splice(index, 1);
}

</script>

<template>
<div class="ModalLayer">
	<div
		v-for="(view, index) in session.modal"
		:key="index"
		class="Modal"
	>
		<component
			:is="views[view.kind]"
			v-bind="view.payload"
			@close="closeModal(index)"
		/>
	</div>
</div>
</template>

<style lang="scss" scoped>
.ModalLayer {
    position: absolute;
    width: 100%;
    height: 100%;

    pointer-events: none;

    >.Modal {
        position: absolute;
        pointer-events: auto;
        background-color: var(--white);
        padding: 1em;

        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>