<script setup lang="ts">
import {type Component, computed} from "vue";
import {useEditorContext, useScopeContext} from "@src/editor/view/context";
import {ActivityKind} from "@src/editor/enum";
import {Button} from "@src/editor/view/component";
import {IconName} from "@src/core/enum";
import {
	EntityCreateUtility,
	SceneExploreUtility,
	ImageCreateUtility,
	ProjectInitUtility,
	SystemUtility,
	MarkerCreateUtility,
} from "@src/editor/view/component/utility-bar/widget";

const editor = useEditorContext();

const activities: Record<ActivityKind, Component[]> = {
	[ActivityKind.System]: [SystemUtility],
	[ActivityKind.ProjectInit]: [ProjectInitUtility],
	[ActivityKind.ProjectExplore]: [SceneExploreUtility],
	[ActivityKind.EntityCreate]: [
		EntityCreateUtility,
		SceneExploreUtility,
	],
	[ActivityKind.ImageCreate]: [
		ImageCreateUtility,
		SceneExploreUtility,
	],
	[ActivityKind.MarkerCreate]: [MarkerCreateUtility],
};

const kit = computed(() => activities[editor.session.activity.kind]);

useScopeContext("UtilityBar");

function goBack(): void {
	if (editor.session.history.length < 2) return;
	const previousActivity = editor.session.history.splice(-2)[0];
	editor.session.activity = previousActivity;
}

</script>

<template>
<div class="UtilityBar">
	<template v-if="kit.length">
		<div class="Head">
			<label>{{ editor.session.activity.kind }} </label>
			<Button
				class="Button"
				:icon="IconName.Back"
				@click="goBack()"
			/>
		</div>
		<component
			:is="utility"
			v-for="(utility, index) in kit"
			:key="index"
		/>
	</template>
</div>
</template>

<style lang="scss" scoped>
.UtilityBar {
    padding: 8px;
    gap: 8px;
    overflow: scroll;

    background-color: var(--gray-94);

	.Head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;

	}
}
</style>