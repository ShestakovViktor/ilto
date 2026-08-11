<script setup lang="ts">
import {type Component, computed} from "vue";
import {useEditorContext, useScopeContext} from "@src/editor/view/context";
import {ActivityKind} from "@src/editor/enum";
import {Button} from "@src/editor/view/component";
import {IconName} from "@src/core/enum";
import {
	EntityCreateUtility,
	EntityUtility,
	ProjectExploreUtility,
	ImageCreateUtility,
	ProjectInitUtility,
	LayerUtility,
	SystemUtility,
	MarkerCreateUtility,
} from "@src/editor/view/component/utility-bar/widget";

const {session} = useEditorContext();

const activities: Record<ActivityKind, Component[]> = {
	[ActivityKind.System]: [SystemUtility],
	[ActivityKind.ProjectInit]: [ProjectInitUtility],
	[ActivityKind.ProjectExplore]: [ProjectExploreUtility],
	[ActivityKind.EntityCreate]: [
		EntityCreateUtility,
		LayerUtility,
		EntityUtility,
	],
	[ActivityKind.ImageCreate]: [ImageCreateUtility],
	[ActivityKind.MarkerCreate]: [MarkerCreateUtility],
};

const kit = computed(() => activities[session.value.activity.kind]);

useScopeContext("UtilityBar");

function goBack(): void {
	if (session.value.history.length < 2) return;
	const previousActivity = session.value.history.splice(-2)[0];
	session.value.activity = previousActivity;
}

</script>

<template>
<div class="UtilityBar">
	<template v-if="kit.length">
		<div class="Head">
			<label>{{ session.activity.kind }} </label>
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